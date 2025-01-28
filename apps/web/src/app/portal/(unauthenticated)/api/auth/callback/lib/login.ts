import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { z } from 'zod'

const schema = z.object({
  sessionId: z.string(),
  sessionToken: z.string(),
})

interface Login {
  userId: string
  idpIntentId: string
  idpIntentToken: string
}

export async function login(params: Login) {
  const response = await fetch(`${authEnv.ZITADEL_ISSUER}/v2/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authEnv.ZITADEL_SA_TOKEN}`,
    },
    body: JSON.stringify({
      checks: {
        user: {
          userId: params.userId,
        },
        idpIntent: {
          idpIntentId: params.idpIntentId,
          idpIntentToken: params.idpIntentToken,
        },
      },
    }),
  })

  const data = await response.json()

  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error('Login failed')
  }

  return result.data
}
