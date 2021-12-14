import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {IDE} from './components/IDE';
import {IDEContext} from './components/IDEContext';

import './idePanel.scss';

function App() {
  const theme =
    chrome.devtools?.panels?.themeName === 'default' ? 'light' : 'dark';

  const [port, setPort] = useState<chrome.runtime.Port | null>(null);

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
  }, []);

  return (
    <IDEContext.Provider
      value={{
        port: port,
        setPort: setPort,
      }}
    >
      <IDE theme={theme}></IDE>
    </IDEContext.Provider>
  );
}

ReactDOM.render(<App></App>, document.querySelector('#ide'));
