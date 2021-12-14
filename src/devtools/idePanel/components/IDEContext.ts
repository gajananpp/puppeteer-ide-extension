import {createContext} from 'react';

export interface IDEContextProps {
  /** port connected to service worker */
  port: chrome.runtime.Port | null;
  setPort: React.Dispatch<React.SetStateAction<chrome.runtime.Port | null>>
}

export const IDEContext = createContext<IDEContextProps>({
  port: null,
  setPort: () => {}
});
