import { z } from 'zod'

export const authEnv = z
  .object({
    AUTH_SESSION_SECRET: z.string(),
    ZITADEL_ISSUER: z.string(),
    ZITADEL_CLIENT_ID: z.string(),
    ZITADEL_CLIENT_SECRET: z.string(),
    ZITADEL_SA_TOKEN: z.string(),
  })
  .parse(process.env)
