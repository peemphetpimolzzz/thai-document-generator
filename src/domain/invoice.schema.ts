import { z } from 'zod';

export const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(), // baht
});

export const invoiceSchema = z.object({
  documentType: z.enum(['invoice', 'receipt']).default('invoice'),
  number: z.string().min(1),
  issueDate: z.string(), // ISO date
  dueDate: z.string().optional(),
  seller: z.object({
    name: z.string().min(1),
    taxId: z.string().optional(),
    address: z.string().optional(),
    branch: z.string().optional(),
  }),
  buyer: z.object({
    name: z.string().min(1),
    taxId: z.string().optional(),
    address: z.string().optional(),
  }),
  items: z.array(lineItemSchema).min(1),
  discount: z.number().nonnegative().default(0), // baht
  vatRate: z.number().nonnegative().default(7), // percent
  note: z.string().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
