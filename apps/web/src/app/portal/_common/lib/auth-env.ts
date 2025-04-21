import { z } from 'zod'

const authSchema = z.object({
  AUTH_SESSION_SECRET: z.string(),
  ZITADEL_ISSUER: z.string(),
  ZITADEL_SA_TOKEN: z.string(),
})

const authParsed = authSchema.safeParse({
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  ZITADEL_ISSUER: process.env.ZITADEL_ISSUER,
  ZITADEL_SA_TOKEN: process.env.ZITADEL_SA_TOKEN,
})

export let authEnv = {
  AUTH_SESSION_SECRET: '',
  ZITADEL_ISSUER: '',
  ZITADEL_SA_TOKEN: '',
}

if (!authParsed.success) {
  if (process.env.npm_lifecycle_event !== 'build') {
    console.error(authParsed.error.issues)
    throw new Error('Failed to parse auth env')
  }
} else {
  authEnv = authParsed.data
}
