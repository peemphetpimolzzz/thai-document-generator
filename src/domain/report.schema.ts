import { z } from 'zod';

const isoDateString = z
  .string()
  .min(1)
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid ISO date');

export const reportSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  dateRange: z.string().optional(),
  date: isoDateString, // ISO date
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .min(1),
  summary: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.number(),
      }),
    )
    .optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
