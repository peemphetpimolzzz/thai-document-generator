import { mapInvoice } from './domain/map';
import { invoiceSchema } from './domain/invoice.schema';
import { reportSchema } from './domain/report.schema';
import { renderPdf } from './renderer/renderPdf';
import { renderHtml } from './templates/compile';

/** Validates invoice input, maps it, renders HTML, and prints it to a PDF buffer. */
export async function renderInvoicePdf(body: unknown): Promise<Buffer> {
  const input = invoiceSchema.parse(body);
  const viewModel = mapInvoice(input);
  return renderPdf(renderHtml('invoice', viewModel));
}

export async function renderReportPdf(body: unknown): Promise<Buffer> {
  const input = reportSchema.parse(body);
  return renderPdf(renderHtml('report', input));
}
