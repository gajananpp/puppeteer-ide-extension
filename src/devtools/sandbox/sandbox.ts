import {executeScript} from './lib/executeScript';

export interface ExecuteScriptCommand {
  type: 'executeScript';
  /** script to execute */
  script: string;
}

type WindowMessage = ExecuteScriptCommand;

window.addEventListener('message', (message: MessageEvent<WindowMessage>) => {
  const command = message.data;
  if (command.type === 'executeScript' && message.source) {
    executeScript(message.source, command.script);
  }
});
