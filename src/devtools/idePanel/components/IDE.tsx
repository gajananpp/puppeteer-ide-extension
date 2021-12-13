import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActionBar} from './ActionBar';
import {Editor} from './Editor';

import puppeteerTypes from '../typedefs/puppeteer.d.ts';
import {Message} from '../../../background';
import {IDEContext} from './IDEContext';
import {ExecuteScriptCommand} from '../../sandbox/sandbox';

interface IDEProps {
  /** IDE theme */
  theme: 'light' | 'dark';
}

const initialScript = [
  "await page.goto('https://wikipedia.org')",
  '',
  "const englishButton = await page.waitForSelector('#js-link-box-en > strong')",
  'await englishButton.click()',
  '',
  'await page.close()',
  '',
].join('\n');

/**
 * IDE component containing the editor and action bar
 * @returns IDE component
 */
export const IDE = (props: IDEProps) => {
  const storedScript = localStorage.getItem('script');
  const [script, setScript] = useState<string>(
    storedScript?.trim().length ? storedScript : initialScript
  );

  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const sandboxRef = useRef<HTMLIFrameElement>(null);

  const {port} = useContext(IDEContext);

  const onEditorContentChange = (value: string) => {
    setScript(value);
    localStorage.setItem('script', value);
  };

  const execute = () => {
    port?.postMessage({
      type: 'startExecution',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  };

  const stop = () => {
    port?.postMessage({
      type: 'stopExecution',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  };

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

  useEffect(() => {
    const portMessageHandler = (message: Message) => {
      if (message.type === 'executionStarted') {
        evalInSandbox(script);
        setIsExecuting(true);
      } else if (message.type === 'executionStopped') {
        setIsExecuting(false);
        sandboxRef.current?.contentWindow?.postMessage(message, '*');
      } else if (message.type === 'cdpEvent') {
        // forward cdp response/event from service worker to sandbox frame
        sandboxRef.current?.contentWindow?.postMessage(message, '*');
      }
    };
    port?.onMessage.addListener(portMessageHandler);

    const windowMessageHandler = (message: MessageEvent<Message>) => {
      if (message.data.type === 'cdpCommand') {
        // forward cdp command coming from sandbox to service worker
        port?.postMessage(message.data);
      }
    };
    window.addEventListener('message', windowMessageHandler);

    return () => {
      port?.onMessage.removeListener(portMessageHandler);
      window.removeEventListener('message', windowMessageHandler);
    };
  }, [script]);

  return (
    <>
      <ActionBar
        theme={props.theme}
        execute={execute}
        stop={stop}
        isExecuting={isExecuting}
      ></ActionBar>
      <Editor
        theme={props.theme}
        onChange={onEditorContentChange}
        extraTypeDefs={[puppeteerTypes]}
        defaultValue={script}
      ></Editor>
      <iframe ref={sandboxRef} src="../sandbox/sandbox.html"></iframe>
    </>
  );
};
