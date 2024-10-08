import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  PORT: z.coerce.number().default(3334),
});

const _env = envSchema.safeParse(process.env);

if (_env.success == false) {
  console.error("Invalid envirionmente variables", _env.error.format());

  throw new Error("Invalid envirionmente variables");
}

export const env = _env.data;
