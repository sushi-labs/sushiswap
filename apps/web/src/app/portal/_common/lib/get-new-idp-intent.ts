import { headers } from 'next/headers'
import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { z } from 'zod'

const newIdpIntentSchema = z.object({
  details: z.object({
    sequence: z.string(),
    changeDate: z.string(),
    resourceOwner: z.string(),
  }),
  authUrl: z.string(),
})

export async function getNewIdpIntent({
  idpId,
}: { idpId: string; type: 'login' | 'connect' }) {
  const headers_ = await headers()
  const host = headers_.get('Host')!
  const proto = headers_.get('X-Forwarded-Proto') || 'https'

  const response = await fetch(`${authEnv.ZITADEL_ISSUER}/v2/idp_intents`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authEnv.ZITADEL_SA_TOKEN}`,
    },
    body: JSON.stringify({
      idpId,
      urls: {
        successUrl: `${proto}://${host}/portal/api/auth/callback`,
        failureUrl: `${proto}://${host}/portal`,
      },
    }),
  })

  const data = await response.json()

  return newIdpIntentSchema.parse(data)
}
