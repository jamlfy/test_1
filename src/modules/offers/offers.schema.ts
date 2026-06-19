import { z } from 'zod';

export const createOfferSchema = z.object({
  body: z.object({
    price: z.number().positive('El precio debe ser mayor a 0'),
    message: z.string().max(500).optional().default(''),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const counterOfferSchema = z.object({
  body: z.object({
    price: z.number().positive('El precio debe ser mayor a 0'),
    message: z.string().max(500).optional().default(''),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const respondCounterSchema = z.object({
  body: z.object({
    action: z.enum(['accept', 'reject', 'counter']),
    price: z.number().positive().optional(),
    message: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
