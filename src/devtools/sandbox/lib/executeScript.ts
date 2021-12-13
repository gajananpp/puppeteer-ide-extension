import puppeteer from 'puppeteer-core/lib/cjs/puppeteer/web';
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
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const executor = new AsyncFunction('page', script);

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
  try {
    await executor(page);
    await browser.close();
  } catch (e) {
    console.error(e);
    await page.close();
    await browser.close();
  }
}
