import 'dotenv/config'

import { z } from 'zod'

export const envSchema = z.object({
  ALCHEMY_ID: z.string(),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Error parsing environment variables')
  console.error(parsed.error.toString())
  process.exit(1)
}

declare global {
  namespace NodeJS {
    interface Process {
      env: z.infer<typeof envSchema>
    }
  }
}
