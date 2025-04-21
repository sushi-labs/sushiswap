import { headers } from 'next/headers'
import { z } from 'zod'
import { getBaseUrl } from './get-base-url'
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
  baseUrl,
  config,
}: {
  baseUrl: string
  config: GetIdpIntentConfig
}) {
  let url = `${baseUrl}/portal/api/auth`

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
  const baseUrl = await getBaseUrl()

  const userServiceClient = getUserServiceClient()

  const response = await userServiceClient.startIdentityProviderIntent({
    $typeName: 'zitadel.user.v2.StartIdentityProviderIntentRequest',
    idpId,
    content: {
      case: 'urls',
      value: {
        $typeName: 'zitadel.user.v2.RedirectURLs',
        successUrl: getSuccessUrl({ baseUrl, config }),
        failureUrl: `${baseUrl}/portal?error_tag=oauthFailed`,
      },
    },
  })

  type Result = Omit<typeof response, 'nextStep'> & {
    nextStep: Extract<(typeof response)['nextStep'], { case: 'authUrl' }>
  }

  return response as Result
}
