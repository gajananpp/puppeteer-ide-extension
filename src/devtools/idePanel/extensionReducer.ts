import * as monaco from 'monaco-editor';

export interface Script {
  id: number;
  name: string;
  value: string;
}

export interface ExtensionState {
  tabs: {
    scriptId: number;
    model: monaco.editor.ITextModel;
  }[];
  scripts: Script[];
  activeTab: number;
  theme: 'light' | 'dark';
}

interface Initialize {
  type: 'initialize';
  state: ExtensionState;
}

interface AddScript {
  type: 'addScript';
  script: Pick<Script, 'name' | 'value'>;
}

interface RemoveScript {
  type: 'removeScript';
  id: number;
}

interface RenameScript {
  type: 'renameScript';
  id: number;
  name: string;
}

interface EditScript {
  type: 'editScript';
  value: string;
}

interface AddTab {
  type: 'addTab';
  script: Script;
}

interface RemoveTab {
  type: 'removeTab';
  tabNumber: number;
}

interface SwitchTab {
  type: 'switchTab';
  tabNumber: number;
}

interface SwitchTheme {
  type: 'switchTheme';
  theme: 'light' | 'dark';
}

export type TabAction = AddTab | RemoveTab | SwitchTab;
export type ScriptAction = AddScript | RemoveScript | RenameScript | EditScript;
export type ThemeAction = SwitchTheme;

export type ExtensionAction =
  | Initialize
  | TabAction
  | ScriptAction
  | ThemeAction;

/**
 * Reducer function to handle extension state
 * @param state extension state
 * @param action dispatched action to be handled
 * @returns new extension state
 */
export function extensionStateReducer(
  state: Readonly<ExtensionState>,
  action: Readonly<ExtensionAction>
): ExtensionState {
  switch (action.type) {
    case 'initialize':
      return action.state;

    case 'addScript':
      return addScript(state, action);

    case 'removeScript':
      return removeScript(state, action);

    case 'renameScript':
      return renameScript(state, action);

    case 'editScript':
      return editScript(state, action);

    case 'addTab':
      return addTab(state, action);

    case 'removeTab':
      return removeTab(state, action);

    case 'switchTab':
      return switchTab(state, action);

    case 'switchTheme':
      return Object.assign({}, state, {
        theme: action.theme,
      });

    default:
      throw new Error(`Unhandled action: ${action}`);
  }
}

function addScript(
  state: Readonly<ExtensionState>,
  action: Readonly<AddScript>
) {
  const scriptId = Date.now();
  return Object.assign({}, state, {
    scripts: [
      ...state.scripts,
      {
        ...action.script,
        id: scriptId,
      },
    ],
    tabs: [
      ...state.tabs,
      {
        scriptId: scriptId,
        model: monaco.editor.createModel(action.script.value, 'javascript'),
      },
    ],
  });
}

function removeScript(
  state: Readonly<ExtensionState>,
  action: Readonly<RemoveScript>
) {
  return Object.assign({}, state, {
    scripts: state.scripts.filter(script => script.id !== action.id),
    tabs: state.tabs.filter(tab => tab.scriptId !== action.id),
    activeTab:
      state.tabs[state.activeTab]?.scriptId === action.id ? 0 : state.activeTab,
  });
}

function renameScript(
  state: Readonly<ExtensionState>,
  action: Readonly<RenameScript>
) {
  return Object.assign({}, state, {
    scripts: state.scripts.map(script => {
      if (script.id === action.id) {
        return {
          ...script,
          name: action.name,
        };
      } else {
        return script;
      }
    }),
  });
}

function editScript(
  state: Readonly<ExtensionState>,
  action: Readonly<EditScript>
) {
  const activeTab = state.tabs[state.activeTab];
  const activeScriptId = activeTab.scriptId;
  return Object.assign({}, state, {
    scripts: state.scripts.map(script => {
      if (script.id === activeScriptId) {
        return {
          ...script,
          value: action.value,
        };
      } else {
        return script;
      }
    }),
  });
}

function addTab(state: Readonly<ExtensionState>, action: Readonly<AddTab>) {
  const tabIdx = state.tabs.findIndex(tab => tab.scriptId === action.script.id);
  if (tabIdx !== -1) {
    return Object.assign({}, state, {
      activeTab: tabIdx,
    });
  } else {
    return Object.assign({}, state, {
      tabs: [
        ...state.tabs,
        {
          scriptId: action.script.id,
          model: monaco.editor.createModel(action.script.value, 'javascript'),
        },
      ],
      activeTab: state.tabs.length,
    });
  }
}

function removeTab(
  state: Readonly<ExtensionState>,
  action: Readonly<RemoveTab>
) {
  return Object.assign({}, state, {
    tabs: state.tabs.filter((_tab, idx) => idx !== action.tabNumber),
    activeTab: state.activeTab === action.tabNumber ? 0 : state.activeTab,
  });
}

function switchTab(
  state: Readonly<ExtensionState>,
  action: Readonly<SwitchTab>
) {
  return Object.assign({}, state, {
    activeTab: action.tabNumber,
  });
}
