import { getBrowser } from './browser';

const MAX_CONCURRENCY = Number(process.env.MAX_CONCURRENCY ?? '2');
let active = 0;
const waiters: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENCY) {
    active++;
    return Promise.resolve();
  }
  return new Promise((resolve) => waiters.push(resolve));
}

function release(): void {
  active--;
  const next = waiters.shift();
  if (next) {
    active++;
    next();
  }
}

/**
 * Renders an HTML document to a PDF buffer. Waits for web fonts to finish loading before
 * printing — the single most common cause of Thai text rendering as empty boxes.
 */
export async function renderPdf(html: string): Promise<Buffer> {
  await acquire();
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      });
      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  } finally {
    release();
  }
}
