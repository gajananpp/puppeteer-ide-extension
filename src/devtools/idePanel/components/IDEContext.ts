import {createContext} from 'react';
import {ExtensionAction} from '../extensionReducer';

export interface IDEContextProps {
  /** port connected to service worker */
  port: chrome.runtime.Port | null;
  /** port updater */
  setPort: React.Dispatch<React.SetStateAction<chrome.runtime.Port | null>>;
  /** extension state action dispatcher */
  dispatch: (action: ExtensionAction) => void;
  /** ide theme */
  theme: 'light' | 'dark';
}

export const IDEContext = createContext<IDEContextProps>({
  port: null,
  setPort: () => {},
  dispatch: (action: ExtensionAction) => action,
  theme: chrome.devtools?.panels?.themeName === 'default' ? 'light' : 'dark',
});
