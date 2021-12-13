import {ConnectionTransport} from 'puppeteer-core';
import {CDPCommand, Message} from '../../../background';

/**
 * A puppeteer connection transport to send/recieve messages
 * to/from host page
 */
export class IDEMessageTransport implements ConnectionTransport {
  /** initialize with undefined as it will be set by puppeteer after transport's instance creation */
  onmessage?: (message: string) => void;
  /** initialize with undefined as it will be set by puppeteer after transport's instance creation */
  onclose?: () => void;

  /** source window object */
  source: MessageEventSource;

  constructor(source: MessageEventSource) {
    this.source = source;
    this.onmessage = undefined;
    this.onclose = undefined;

    // register listener to handle cdp events
    this._cdpEventHandler = this._cdpEventHandler.bind(this);
    window.addEventListener('message', this._cdpEventHandler);
  }

  /**
   * sends serialized cdp command to service worker through host window for execution by chrome.debugger
   * and emit response back to puppeteer
   * @param message - stringified cdp command
   */
  send(message: string) {
    const command: CDPCommand = {
      type: 'cdpCommand',
      command: message,
    };
    this.source.postMessage(command, '*' as any);
  }

  /**
   * close debugger session
   */
  close(): void {
    this.onclose?.call(null);
    window.removeEventListener('message', this._cdpEventHandler);
  }

  /**
   * Handler for incoming response/event. It passes back the response to puppeteer
   * @param message - message coming from main window
   */
  private _cdpEventHandler(message: MessageEvent<Message>) {
    const event = message.data;
    event.type === 'cdpEvent' ? this.onmessage?.call(null, event.data) : null;
    // call close explicitly on debugger stopped event
    event.type === 'executionStopped' ? this.close() : null;
  }
}
