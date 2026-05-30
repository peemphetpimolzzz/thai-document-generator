import puppeteer, { Browser } from 'puppeteer';
import { launchArgs } from './launchArgs';

// A single lazily-launched browser is shared across requests; a fresh page is opened per
// render. If Chromium disconnects (crash), the next call relaunches it.
let browserPromise: Promise<Browser> | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({ headless: true, args: launchArgs });
    const browser = await browserPromise;
    browser.on('disconnected', () => {
      browserPromise = null;
    });
  }
  return browserPromise;
}

export async function closeBrowser(): Promise<void> {
  if (!browserPromise) {
    return;
  }
  const browser = await browserPromise;
  browserPromise = null;
  await browser.close();
}
