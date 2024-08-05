import { z } from "zod"

export const env = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    AUTH_COOKIE_NAME: z.string(),
    AUTH_COOKIE_DOMAIN: z.string().optional(),
    DATABASE_URL: z.string(),

    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
  })
  .parse(process.env)
