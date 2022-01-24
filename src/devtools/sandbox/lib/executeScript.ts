import puppeteer from 'puppeteer-core/lib/cjs/puppeteer/web';
import {ConsoleCommand} from '../../../background';
import {IDEMessageTransport} from './messageTransport';

/**
 * Initializes puppeteer and executes the given script under
 * context of `page`
 * @param source - source window object from which to send/receive messages
 * @param script - puppeteer script to execute
 */
export async function executeScript(
  source: MessageEventSource,
  script: string
) {
  const console = {
    log: (...args: any[]) => {
      try {
        window.console.log(...args);
        const consoleCmd: ConsoleCommand = {
          type: 'console',
          level: 'log',
          args: JSON.stringify(args),
        };
        source.postMessage(consoleCmd, '*' as any);
      } catch (e) {
        null;
      }
    },
    error: (...args: any[]) => {
      try {
        window.console.error(...args);
        const consoleCmd: ConsoleCommand = {
          type: 'console',
          level: 'error',
          args: JSON.stringify(args),
        };
        source.postMessage(consoleCmd, '*' as any);
      } catch (e) {
        null;
      }
    },
  };
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const executor = new AsyncFunction('page', 'console', script);

  const ideTransport = new IDEMessageTransport(source);
  const browser = await puppeteer.connect({
    transport: ideTransport,
    defaultViewport: null,
    // defaultViewport: {
    //   deviceScaleFactor: window.devicePixelRatio,
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // },
  });

  const [page] = await browser.pages();

  const close = async () => {
    try {
      if (!page.isClosed()) {
        await page.close();
        await browser.close();
      }
    } catch (e) {
      null;
    }
  };

  try {
    await executor(page, console);
    await close();
  } catch (e) {
    window.console.error(e);
    await close();
    console.error((<Error>e)?.message);
  }
}
