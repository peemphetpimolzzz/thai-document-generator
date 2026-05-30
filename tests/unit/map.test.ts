import { describe, expect, it } from 'vitest';
import { invoiceSchema } from '../../src/domain/invoice.schema';
import { mapInvoice } from '../../src/domain/map';

describe('mapInvoice', () => {
  const viewModel = mapInvoice(
    invoiceSchema.parse({
      number: 'INV-1',
      issueDate: '2026-05-30',
      seller: { name: 'S' },
      buyer: { name: 'B' },
      items: [
        { description: 'A', quantity: 2, unitPrice: 100 },
        { description: 'B', quantity: 1, unitPrice: 50 },
      ],
      discount: 0,
      vatRate: 7,
    }),
  );

  it('computes line amounts in satang', () => {
    expect(viewModel.items[0].amount).toBe(20000); // 2 x 100.00
    expect(viewModel.items[1].amount).toBe(5000); // 1 x 50.00
  });

  it('computes subtotal, VAT and total', () => {
    expect(viewModel.subtotal).toBe(25000); // 250.00
    expect(viewModel.vat).toBe(1750); // 7% of 250.00
    expect(viewModel.total).toBe(26750); // 267.50
  });

  it('defaults an invoice title', () => {
    expect(viewModel.documentTitle).toBe('ใบแจ้งหนี้');
  });

  it('applies discount before VAT', () => {
    const discounted = mapInvoice(
      invoiceSchema.parse({
        number: 'INV-2',
        issueDate: '2026-05-30',
        seller: { name: 'S' },
        buyer: { name: 'B' },
        items: [{ description: 'A', quantity: 1, unitPrice: 1000 }],
        discount: 100,
        vatRate: 7,
      }),
    );
    expect(discounted.subtotal).toBe(100000); // 1,000.00
    expect(discounted.discount).toBe(10000); // 100.00
    expect(discounted.vat).toBe(6300); // 7% of 900.00
    expect(discounted.total).toBe(96300); // 963.00
  });
});
