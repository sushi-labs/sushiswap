import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { z } from 'zod'
import { IdpIntent } from './get-idp-intent'

const schema = z.object({
  userId: z.string(),
})

export async function register(idpIntent: IdpIntent) {
  const respose = await fetch(`${authEnv.ZITADEL_ISSUER}/v2/users/human`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authEnv.ZITADEL_SA_TOKEN}`,
    },
    body: JSON.stringify({
      profile: {
        givenName: idpIntent.idpInformation.rawInformation.givenName,
        familyName: idpIntent.idpInformation.rawInformation.familyName,
      },
      email: {
        email: idpIntent.idpInformation.rawInformation.email,
        isVerified: true,
      },
      idpLinks: [
        {
          idpId: idpIntent.idpInformation.idpId,
          userId: idpIntent.idpInformation.userId,
          userName: idpIntent.idpInformation.rawInformation.email,
        },
      ],
    }),
  })

  const registrationData = await respose.json()

  const result = schema.safeParse(registrationData)

  if (!result.success) {
    throw new Error('Registration failed')
  }

  return result.data
}
