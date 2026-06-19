import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    productName: z.string().min(1).max(200),
    description: z.string().max(1000).optional().default(''),
  }),
});
