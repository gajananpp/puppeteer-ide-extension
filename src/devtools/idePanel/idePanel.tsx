import React, {useEffect, useState, useRef, useReducer} from 'react';
import ReactDOM from 'react-dom';
import * as monaco from 'monaco-editor';
import puppeteerTypes from './typedefs/puppeteer.d.ts';
import {EditorTabs} from './components/EditorTabs';
import {IDEContext} from './components/IDEContext';
import {ActionBar} from './components/ActionBar';

import './idePanel.scss';
import {Editor} from './components/Editor';
import {ExecuteScriptCommand} from '../sandbox/sandbox';
import {Message} from '../../background';
import {
  ExtensionState,
  extensionStateReducer,
  Script,
} from './extensionReducer';
import {getElementSelector} from './utils/getElementSelector';

export const initialScript = `
await page.goto('https://wikipedia.org')

const englishButton = await page.waitForSelector('#js-link-box-en > strong')
await englishButton.click()

const searchBox = await page.waitForSelector('#searchInput')
await searchBox.type('telephone')

await page.keyboard.press('Enter')
await page.close()
`;

function App() {
  const theme =
    chrome.devtools?.panels?.themeName === 'default' ? 'light' : 'dark';

  const initialExtensionState: ExtensionState = {
    tabs: [],
    scripts: [],
    activeTab: 0,
    theme: theme,
  };

  const [extensionState, dispatch] = useReducer(
    extensionStateReducer,
    initialExtensionState
  );
  const [port, setPort] = useState<chrome.runtime.Port | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  const sandboxRef = useRef<HTMLIFrameElement>(null);

  /**
   * Read and delete script from older version if available
   * @returns script from older version of extension
   */
  const portOldScript = async () => {
    const scriptStore = await chrome.storage.local.get('script');
    if (scriptStore.script) {
      await chrome.storage.local.remove('script');
      return {
        id: Date.now(),
        name: 'anonymous',
        value: scriptStore.script,
      };
    } else {
      return null;
    }
  };

  const getScriptById = (scriptId: number) => {
    return extensionState.scripts.find(script => script.id === scriptId);
  };

  /**
   * Creates react state from state serialized in `chrome.storage`
   * If not available, creates initial state and ports script from older version if available
   */
  const getExtensionState = async () => {
    const extensionStore = await chrome.storage.local.get('state');
    if (extensionStore.state) {
      const state: ExtensionState = extensionStore.state;
      state.tabs = state.tabs.map(tab => {
        const script = state.scripts.find(script => script.id === tab.scriptId);
        return {
          scriptId: script?.id || 0,
          model: monaco.editor.createModel(script?.value || '', 'javascript'),
        };
      });
      dispatch({
        type: 'initialize',
        state: state,
      });
    } else {
      const sampleScript: Script = {
        id: Date.now(),
        name: 'sample',
        value: initialScript,
      };
      const state: ExtensionState = {
        scripts: [sampleScript],
        tabs: [
          {
            scriptId: sampleScript.id,
            model: monaco.editor.createModel(sampleScript.value, 'javascript'),
          },
        ],
        activeTab: 0,
        theme: initialExtensionState.theme,
      };
      const oldScript = await portOldScript();
      if (oldScript) {
        state.scripts.push(oldScript);
        state.tabs.push({
          scriptId: oldScript.id,
          model: monaco.editor.createModel(oldScript.value, 'javascript'),
        });
        state.activeTab = 1;
      }
      dispatch({
        type: 'initialize',
        state: state,
      });
    }
  };

  /**
   * Get selected element's selector
   * @returns selector for current selected element or null
   */
  const elementSelectorSuggestor = (): Promise<string> => {
    return new Promise(resolve => {
      // replacing `exports.` with '' as tsc adds it while compiling
      chrome.devtools.inspectedWindow.eval(
        `
      var getElementSelector = ${getElementSelector
        .toString()
        .replace(/(\w+\.)(?=getElementSelector)/, '')}
      $0 ? getElementSelector($0) : ''
      `,
        (result, error) => {
          error?.value ? resolve('') : resolve(result as string);
        }
      );
    });
  };

  /**
   * Registers suggestions provider for editor
   */
  const registerSuggestionsProvider = () => {
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: async function (model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: [
            {
              label: '"$0"',
              kind: monaco.languages.CompletionItemKind.Value,
              documentation: 'Get selector of currently selected element',
              insertText: `"${await elementSelectorSuggestor()}"`,
              range: range,
            },
          ],
        };
      },
    });
  };

  /**
   * Registers type definitions for editor
   */
  const registerTypeDefs = () => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(puppeteerTypes);
  };

  /**
   * Custom actions provider for editor
   * @returns Action dispatcher
   */
  const editorActionProvider = () => {
    return [];
  };

  /**
   * Save state changes to `chrome.storage`
   */
  const saveExtensionState = async () => {
    await chrome.storage.local.set({
      state: {
        ...extensionState,
        tabs: extensionState.tabs.map(tab => {
          return {
            scriptId: tab.scriptId,
          };
        }),
      },
    });
  };

  /** Script execution triggerer */
  const execute = () => {
    port?.postMessage({
      type: 'startExecution',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  };

  /** Script execution stop triggerer */
  const stop = () => {
    port?.postMessage({
      type: 'stopExecution',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  };

  /** Evals puppeteer script in sandbox frame */
  const evalInSandbox = (script: string) => {
    const sandboxFrame = sandboxRef.current;
    if (sandboxFrame) {
      const executeCommand: ExecuteScriptCommand = {
        type: 'executeScript',
        script: script,
      };
      sandboxFrame.contentWindow?.postMessage(executeCommand, '*');
    }
  };

  /** Connect to background service worker. */
  const connectPort = () => {
    const port = chrome.runtime.connect({
      name: `${chrome.devtools.inspectedWindow.tabId}`,
    });
    setPort(port);
    port.onDisconnect.addListener(() => {
      setTimeout(() => connectPort(), 1 * 1000);
    });
  };

  useEffect(() => {
    connectPort();
    getExtensionState();
    registerTypeDefs();
    registerSuggestionsProvider();
  }, []);

  useEffect(() => {
    if (isLoading) setIsLoading(false);
    saveExtensionState();
  }, [extensionState]);

  useEffect(() => {
    /**
     * Handles messages from background service worker and passes cdp responses/events
     * to sandbox frame
     * @param message - incoming message from background service worker
     */
    const portMessageHandler = (message: Message) => {
      if (message.type === 'executionStarted') {
        const activeTab = extensionState.tabs[extensionState.activeTab];
        const script = getScriptById(activeTab.scriptId);
        if (script) {
          evalInSandbox(script.value);
          setIsExecuting(true);
        }
      } else if (message.type === 'executionStopped') {
        setIsExecuting(false);
        sandboxRef.current?.contentWindow?.postMessage(message, '*');
      } else if (message.type === 'cdpEvent') {
        // forward cdp response/event from service worker to sandbox frame
        sandboxRef.current?.contentWindow?.postMessage(message, '*');
      }
    };
    port?.onMessage.addListener(portMessageHandler);

    /**
     * Handles messages from sandbox frame and passes cdp commands
     * to background service worker
     * @param message incoming message from sandbox frame
     */
    const windowMessageHandler = (message: MessageEvent<Message>) => {
      if (message.data.type === 'cdpCommand') {
        // forward cdp command coming from sandbox to service worker
        port?.postMessage(message.data);
      } else if (message.data.type === 'console') {
        const consoleCommand = message.data;
        chrome.devtools.inspectedWindow.eval(
          `console.${consoleCommand.level}(...${consoleCommand.args})`
        );
      }
    };
    window.addEventListener('message', windowMessageHandler);

    return () => {
      port?.onMessage.removeListener(portMessageHandler);
      window.removeEventListener('message', windowMessageHandler);
    };
  }, [extensionState, port]);

  if (!isLoading) {
    const activeTab = extensionState.tabs[extensionState.activeTab];

    return (
      <IDEContext.Provider
        value={{
          port: port,
          setPort: setPort,
          dispatch: dispatch,
          theme: extensionState.theme,
        }}
      >
        <ActionBar
          execute={execute}
          stop={stop}
          activeTab={activeTab}
          isExecuting={isExecuting}
          scripts={extensionState.scripts}
        ></ActionBar>
        <EditorTabs
          activeTab={extensionState.activeTab}
          getScriptById={getScriptById}
          tabs={extensionState.tabs}
        ></EditorTabs>
        {activeTab?.model ? (
          <Editor
            onChange={value =>
              dispatch({
                type: 'editScript',
                value: value,
              })
            }
            actions={editorActionProvider()}
            model={activeTab.model}
          />
        ) : null}
        <iframe ref={sandboxRef} src="../sandbox/sandbox.html"></iframe>
      </IDEContext.Provider>
    );
  } else {
    return null;
  }
}

ReactDOM.render(<App></App>, document.querySelector('#ide'));
