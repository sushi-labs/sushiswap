import { headers } from 'next/headers'
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

  const response = await userServiceClient.startIdentityProviderIntent({
    $typeName: 'zitadel.user.v2.StartIdentityProviderIntentRequest',
    idpId,
    content: {
      case: 'urls',
      value: {
        $typeName: 'zitadel.user.v2.RedirectURLs',
        successUrl: getSuccessUrl({ host, proto, config }),
        failureUrl: `${proto}://${host}/portal/login?error_tag=oauthFailed`,
      },
    },
  })

  type Result = Omit<typeof response, 'nextStep'> & {
    nextStep: Extract<(typeof response)['nextStep'], { case: 'authUrl' }>
  }

  return response as Result
}
