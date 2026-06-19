import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string().default("7d"),
    PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
