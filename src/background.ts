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
      ? DebuggerHandler.create(message.tabId)
      : null;
  });
  port.onDisconnect.addListener(port => delete connections[port.name]);
});

class DebuggerHandler {
  private static _debuggerHandler: DebuggerHandler;

  static isExecuting = false;

  transport: ExtensionDebuggerTransport;
  tabId: number;

  /**
   * Starts debugger session, executes incoming cdp commands on target tab
   * and emits events/responses back to command sender
   * @param tabId - id of the target tab
   */
  static async create(tabId: number) {
    if (this.isExecuting && this._debuggerHandler) {
      this._debuggerHandler._registerListeners();
      return this._debuggerHandler;
    } else {
      const transport = await ExtensionDebuggerTransport.create(tabId);
      this._debuggerHandler = new DebuggerHandler(tabId, transport);
      return this._debuggerHandler;
    }
  }

  constructor(tabId: number, transport: ExtensionDebuggerTransport) {
    DebuggerHandler.isExecuting = true;
    this.tabId = tabId;
    this.transport = transport;
    this.transport.delay = 0.1 * 1000;
    this._registerListeners();
  }

  private _registerListeners() {
    const port = connections[this.tabId];

    this.transport.onmessage = message => {
      const cdpEvent: CDPEvent = {
        type: 'cdpEvent',
        data: message,
      };
      // send response/instrumentation event back
      port?.postMessage(cdpEvent);
    };

    this.transport.onclose = () => {
      DebuggerHandler.isExecuting = false;
      this._unregisterListeners();
      const executionEvent: ExecutionEvent = {
        type: 'executionStopped',
        tabId: this.tabId,
      };
      port?.postMessage(executionEvent);
    };

    this._incomingMessageHandler = this._incomingMessageHandler.bind(this);
    port?.onMessage.addListener(this._incomingMessageHandler);

    const executionEvent: ExecutionEvent = {
      type: 'executionStarted',
      tabId: this.tabId,
    };
    port?.postMessage(executionEvent);
  }

  private _unregisterListeners() {
    this.transport.onmessage = undefined;
    this.transport.onclose = undefined;
    connections[this.tabId]?.onMessage.removeListener(
      this._incomingMessageHandler
    );
  }

  private _incomingMessageHandler(message: Message) {
    if (message.type === 'cdpCommand') {
      // pass command to chrome.debugger
      this.transport.send(message.command);
    } else if (message.type === 'stopExecution') {
      this.transport.close();
    }
  }
}
