import * as z from 'zod'
import { getUserServiceClient } from './zitadel-client'

const googleSchema = z.object({
  User: z.object({
    email: z.string(),
    given_name: z.string(),
    name: z.string(),
  }),
})

const githubSchema = z.object({
  email: z.string(),
  name: z.string(),
})

const rawInformationSchema = googleSchema
  .or(githubSchema.or(z.object({})))
  .transform((rawInfo) => {
    let userData:
      | {
          email: string
          familyName: string
          givenName: string
          name: string
        }
      | undefined = undefined

    // Google
    if ('User' in rawInfo) {
      userData = {
        email: rawInfo.User.email,
        familyName: 'Google',
        givenName: rawInfo.User.given_name,
        name: rawInfo.User.name,
      }
    }

    // Github
    if ('email' in rawInfo) {
      userData = {
        email: rawInfo.email,
        familyName: 'GitHub',
        givenName: rawInfo.name,
        name: rawInfo.name,
      }
    }

    if (!userData) {
      throw new Error('Invalid raw information')
    }

    return userData
  })

export type IdpIntent = Awaited<ReturnType<typeof getIdpIntent>>

export async function getIdpIntent(id: string, token: string) {
  const userServiceClient = getUserServiceClient()
  const response = await userServiceClient.retrieveIdentityProviderIntent({
    $typeName: 'zitadel.user.v2.RetrieveIdentityProviderIntentRequest',
    idpIntentId: id,
    idpIntentToken: token,
  })

  if (!response.idpInformation) {
    throw new Error(`Missing idpInformation`)
  }

  const userData = rawInformationSchema.safeParse(
    response.idpInformation.rawInformation,
  )

  if (!userData.success) {
    throw new Error(`Couldn't parse rawInformation`)
  }

  return {
    ...response,
    idpInformation: response.idpInformation,
    userData: userData.data,
  }
}
