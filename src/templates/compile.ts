import Handlebars from 'handlebars';
import { invoiceTemplate } from './invoice';
import { layout } from './layout';
import { registerHelpers } from './registerHelpers';
import { reportTemplate } from './report';

registerHelpers();

const templates = {
  invoice: Handlebars.compile(invoiceTemplate),
  report: Handlebars.compile(reportTemplate),
};

const FONT_DIR = process.env.FONT_DIR ?? '/app/fonts';

export type TemplateKind = keyof typeof templates;

export function renderHtml(kind: TemplateKind, viewModel: unknown): string {
  const body = templates[kind](viewModel);
  return layout(FONT_DIR, body);
}
