import { toSatang } from '../format/money';
import { InvoiceInput } from './invoice.schema';

export interface InvoiceLineViewModel {
  index: number;
  description: string;
  quantity: number;
  unitPrice: number; // satang
  amount: number; // satang
}

export interface InvoiceViewModel {
  documentType: string;
  documentTitle: string;
  number: string;
  issueDate: string;
  dueDate?: string;
  seller: InvoiceInput['seller'];
  buyer: InvoiceInput['buyer'];
  items: InvoiceLineViewModel[];
  subtotal: number; // satang
  discount: number; // satang
  vatRate: number; // percent
  vat: number; // satang
  total: number; // satang
  note?: string;
}

/** Maps validated invoice input to a view model with all money pre-computed in satang. */
export function mapInvoice(input: InvoiceInput): InvoiceViewModel {
  const items = input.items.map<InvoiceLineViewModel>((item, index) => {
    const unitPrice = toSatang(item.unitPrice);
    return {
      index: index + 1,
      description: item.description,
      quantity: item.quantity,
      unitPrice,
      amount: Math.round(unitPrice * item.quantity),
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discount = toSatang(input.discount);
  const taxable = Math.max(0, subtotal - discount);
  const vat = Math.round((taxable * input.vatRate) / 100);
  const total = taxable + vat;

  return {
    documentType: input.documentType,
    documentTitle: input.documentType === 'receipt' ? 'ใบเสร็จรับเงิน' : 'ใบแจ้งหนี้',
    number: input.number,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    seller: input.seller,
    buyer: input.buyer,
    items,
    subtotal,
    discount,
    vatRate: input.vatRate,
    vat,
    total,
    note: input.note,
  };
}
