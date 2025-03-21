import { z } from 'zod'
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

const schema = z
  .object({
    details: z.object({
      sequence: z.string(),
      changeDate: z.string(),
      resourceOwner: z.string(),
    }),
    idpInformation: z.object({
      oauth: z
        .object({
          accessToken: z.string(),
          idToken: z.string().optional(),
        })
        .nullable(),
      ldap: z.object({}).optional(),
      saml: z.object({}).optional(),
      idpId: z.string(),
      userId: z.string(),
      userName: z.string(),
      rawInformation: googleSchema.or(githubSchema.or(z.object({}))),
    }),
    userId: z.string().optional(),
  })
  .transform((data) => {
    const rawInfo = data.idpInformation.rawInformation

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

    return {
      details: {
        sequence: data.details.sequence,
        changeDate: data.details.changeDate,
        resourceOwner: data.details.resourceOwner,
      },
      idpInformation: {
        oauth: data.idpInformation.oauth,
        ldap: data.idpInformation.ldap,
        saml: data.idpInformation.saml,
        idpId: data.idpInformation.idpId,
        userId: data.idpInformation.userId,
        userName: data.idpInformation.userName,
        rawInformation: userData,
      },
      userId: data.userId,
    }
  })

export type IdpIntent = z.infer<typeof schema>

export async function getIdpIntent(id: string, token: string) {
  const userServiceClient = getUserServiceClient()
  const response = await userServiceClient.retrieveIdentityProviderIntent({
    $typeName: 'zitadel.user.v2.RetrieveIdentityProviderIntentRequest',
    idpIntentId: id,
    idpIntentToken: token,
  })

  const result = schema.safeParse(response)

  if (!result.success) {
    throw new Error(`Couldn't get intent`)
  }

  return result.data
}
