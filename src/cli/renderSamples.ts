import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderInvoicePdf, renderReportPdf } from '../documents';
import { closeBrowser } from '../renderer/browser';

/** Renders the bundled sample documents to ./output so the project is demoable with no code. */
async function main(): Promise<void> {
  const outputDir = process.env.OUTPUT_DIR ?? '/app/output';
  await mkdir(outputDir, { recursive: true });

  const invoice = JSON.parse(await readFile('samples/invoice.sample.json', 'utf8'));
  const report = JSON.parse(await readFile('samples/report.sample.json', 'utf8'));

  await writeFile(path.join(outputDir, 'invoice.pdf'), await renderInvoicePdf(invoice));
  await writeFile(path.join(outputDir, 'report.pdf'), await renderReportPdf(report));

  console.log(`[info] wrote invoice.pdf and report.pdf to ${outputDir}`);
  await closeBrowser();
}

main().catch((error) => {
  console.error('[error]', error);
  process.exit(1);
});
