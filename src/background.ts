import {ExtensionDebuggerTransport} from 'puppeteer-extension-transport';

export interface ExecutionCommand {
  type: 'startExecution' | 'stopExecution';
  tabId: number;
}

export interface ExecutionEvent {
  type: 'executionStarted' | 'executionStopped';
  tabId: number;
}

export interface CDPCommand {
  type: 'cdpCommand';
  command: string;
}

export interface CDPEvent {
  type: 'cdpEvent';
  data: string;
}

export interface ConnectionEvent {
  type: 'connected';
}

export type Message =
  | ExecutionCommand
  | CDPCommand
  | CDPEvent
  | ExecutionEvent
  | ConnectionEvent;

interface Connections {
  /** key is the stringified tabId */
  [key: string]: chrome.runtime.Port;
}

const connections: Connections = {};

chrome.runtime.onConnect.addListener(port => {
  connections[port.name] = port;

  const connectedEvent: ConnectionEvent = {type: 'connected'};
  port.postMessage(connectedEvent);

  port.onMessage.addListener((message: Message) => {
    message.type === 'startExecution'
      ? executePuppeteerScript(port, message.tabId)
      : null;
  });
  port.onDisconnect.addListener(port => delete connections[port.name]);
});

/**
 * Starts debugger session, executes incoming cdp commands on target tab
 * and emits events/responses back to command sender
 * @param port - port connected to devtools
 * @param tabId - id of the target tab
 */
async function executePuppeteerScript(
  port: chrome.runtime.Port,
  tabId: number
) {
  const debuggerTransport = await ExtensionDebuggerTransport.create(tabId);
  debuggerTransport.delay = 0.05 * 1000;

  const executionEvent: ExecutionEvent = {
    type: 'executionStarted',
    tabId: tabId,
  };
  port.postMessage(executionEvent);

  const messageHandler = (message: Message) => {
    if (message.type === 'cdpCommand') {
      // pass command to chrome.debugger
      debuggerTransport.send(message.command);
    } else if (message.type === 'stopExecution') {
      debuggerTransport.close();
    }
  };

  port.onMessage.addListener(messageHandler);

  debuggerTransport.onmessage = message => {
    const cdpEvent: CDPEvent = {
      type: 'cdpEvent',
      data: message,
    };
    // send response/instrumentation event back
    port.postMessage(cdpEvent);
  };

  debuggerTransport.onclose = () => {
    // clear everything

    debuggerTransport.onmessage = undefined;
    debuggerTransport.onclose = undefined;

    port.onMessage.removeListener(messageHandler);
    const executionEvent: ExecutionEvent = {
      type: 'executionStopped',
      tabId: tabId,
    };
    port.postMessage(executionEvent);
  };
}
