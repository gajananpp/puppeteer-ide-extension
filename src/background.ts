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

export interface ConsoleCommand {
  type: 'console';
  level: 'log' | 'error';
  args: string;
}

export type Message =
  | ExecutionCommand
  | CDPCommand
  | ConsoleCommand
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
  commands: {command: any; response: any}[];
  events: any[];

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
    this.transport.delay = 0.05 * 1000;
    this.commands = [];
    this.events = [];

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
      const parsedEvent = JSON.parse(message);
      if (parsedEvent.id) {
        // event is a response if contains `id` property which corresponds to a command
        const cmdIdx = this.commands.findIndex(
          commandObj => commandObj.command.id === parsedEvent.id
        );
        cmdIdx !== -1 ? (this.commands[cmdIdx].response = parsedEvent) : null;
      } else {
        this.events.push(parsedEvent);
      }
    };

    this.transport.onclose = () => {
      DebuggerHandler.isExecuting = false;
      this._unregisterListeners();
      const executionEvent: ExecutionEvent = {
        type: 'executionStopped',
        tabId: this.tabId,
      };
      port?.postMessage(executionEvent);
      console.log('CDP LOGS');
      console.log({
        commands: this.commands,
        events: this.events,
      });
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
      this.commands.push({
        command: JSON.parse(message.command),
        response: {},
      });
    } else if (message.type === 'stopExecution') {
      this.transport.close();
    }
  }
}
