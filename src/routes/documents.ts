import { Response, Router } from 'express';
import { renderInvoicePdf, renderReportPdf } from '../documents';

export const documentsRouter = Router();

function sendPdf(res: Response, pdf: Buffer, filename: string, inline: boolean): void {
  const disposition = inline ? 'inline' : 'attachment';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', pdf.length);
  res.setHeader('Content-Disposition', `${disposition}; filename="${filename}"`);
  res.end(pdf);
}

documentsRouter.post('/invoice', async (req, res, next) => {
  try {
    const pdf = await renderInvoicePdf(req.body);
    const number = typeof req.body?.number === 'string' ? req.body.number : 'document';
    sendPdf(res, pdf, `invoice-${number}.pdf`, req.query.inline === 'true');
  } catch (error) {
    next(error);
  }
});

documentsRouter.post('/report', async (req, res, next) => {
  try {
    const pdf = await renderReportPdf(req.body);
    sendPdf(res, pdf, 'report.pdf', req.query.inline === 'true');
  } catch (error) {
    next(error);
  }
});
