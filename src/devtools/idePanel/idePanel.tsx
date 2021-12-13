import React from 'react';
import ReactDOM from 'react-dom';
import {Message} from '../../background';
import {IDE} from './components/IDE';
import {IDEContext, IDEContextProps} from './components/IDEContext';

import './idePanel.scss';

interface AppProps extends IDEContextProps {}

function App(props: AppProps) {
  const theme =
    chrome.devtools?.panels?.themeName === 'default' ? 'light' : 'dark';

  return (
    <IDEContext.Provider value={props}>
      <IDE theme={theme}></IDE>
    </IDEContext.Provider>
  );
}

const port = chrome.runtime.connect({
  name: `${chrome.devtools.inspectedWindow.tabId}`,
});

port.onMessage.addListener((message: Message) => {
  if (message.type === 'connected') {
    ReactDOM.render(<App port={port}></App>, document.querySelector('#ide'));
  }
});
