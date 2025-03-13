import { z } from 'zod'

console.log(process.env)

export const authEnv = z
  .object({
    AUTH_SESSION_SECRET: z.string(),
    ZITADEL_ISSUER: z.string(),
    ZITADEL_CLIENT_ID: z.string(),
    ZITADEL_CLIENT_SECRET: z.string(),
    ZITADEL_SA_TOKEN: z.string(),
  })
  .parse({
    AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
    ZITADEL_ISSUER: process.env.ZITADEL_ISSUER,
    ZITADEL_CLIENT_ID: process.env.ZITADEL_CLIENT_ID,
    ZITADEL_CLIENT_SECRET: process.env.ZITADEL_CLIENT_SECRET,
    ZITADEL_SA_TOKEN: process.env.ZITADEL_SA_TOKEN,
  })
