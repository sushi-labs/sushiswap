import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { z } from 'zod'

// Not exhaustive
// https://zitadel.com/docs/apis/resources/user_service_v2/user-service-get-user-by-id
const schema = z.object({
  user: z.object({
    userId: z.string(),
    state: z.enum([
      'USER_STATE_UNSPECIFIED',
      'USER_STATE_ACTIVE',
      'USER_STATE_INACTIVE',
      'USER_STATE_DELETED',
      'USER_STATE_LOCKED',
      'USER_STATE_INITIAL',
    ]),
    username: z.string(),
    loginNames: z.array(z.string()),
    preferredLoginName: z.string(),
    human: z.object({
      email: z.object({
        email: z.string(),
        isVerified: z.boolean(),
      }),
    }),
  }),
})

export async function getUserById(id: string) {
  const response = await fetch(`${authEnv.ZITADEL_ISSUER}/v2/users/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${authEnv.ZITADEL_SA_TOKEN}`,
    },
  })

  const data = await response.json()

  const result = schema.safeParse(data)

  if (!result.success) {
    throw new Error(`Couldn't fetch user data`)
  }

  return result.data.user
}
