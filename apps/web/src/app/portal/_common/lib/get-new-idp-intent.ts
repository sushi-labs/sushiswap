import { headers } from 'next/headers'
import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { z } from 'zod'
import { getUserServiceClient } from './zitadel-client'

export const getIdpIntentSchema = z
  .object({
    type: z.literal('login'),
  })
  .or(
    z.object({
      type: z.literal('connect'),
      redirect: z.string(),
    }),
  )

export type GetIdpIntentConfig = z.infer<typeof getIdpIntentSchema>

const newIdpIntentSchema = z.object({
  details: z.object({
    sequence: z.string(),
    changeDate: z.string(),
    resourceOwner: z.string(),
  }),
  authUrl: z.string(),
})

function getSuccessUrl({
  host,
  proto,
  config,
}: {
  host: string
  proto: string
  config: GetIdpIntentConfig
}) {
  let url = `${proto}://${host}/portal/api/auth`

  switch (config.type) {
    case 'login': {
      url += '/callback'
      break
    }
    case 'connect': {
      url += `/callback-connect?redirect=${config.redirect}`
      break
    }
  }

  return url
}

export async function getNewIdpIntent({
  idpId,
  config,
}: {
  idpId: string
  config: GetIdpIntentConfig
}) {
  const headers_ = await headers()
  const host = headers_.get('Host')!
  const proto = headers_.get('X-Forwarded-Proto') || 'https'

  const userServiceClient = getUserServiceClient()

  const response = userServiceClient.startIdentityProviderIntent({
    $typeName: 'zitadel.user.v2.StartIdentityProviderIntentRequest',
    idpId,
    content: {
      case: 'urls',
      value: {
        $typeName: 'zitadel.user.v2.RedirectURLs',
        successUrl: getSuccessUrl({ host, proto, config }),
        failureUrl: `${proto}://${host}/portal`,
      },
    },
  })

  return newIdpIntentSchema.parse(response)
}
