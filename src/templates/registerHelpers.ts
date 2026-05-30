import Handlebars from 'handlebars';
import { bahtText } from '../format/bahttext';
import { formatThaiDate } from '../format/date';
import { formatTHB } from '../format/money';

let registered = false;

export function registerHelpers(): void {
  if (registered) {
    return;
  }
  registered = true;

  Handlebars.registerHelper('baht', (satang: number) => formatTHB(satang));
  Handlebars.registerHelper('bahtText', (satang: number) => bahtText(satang));
  Handlebars.registerHelper('thaiDate', (iso: string, era?: unknown) =>
    formatThaiDate(iso, era === 'ce' ? 'ce' : 'be'),
  );
}
