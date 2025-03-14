import { authEnv } from 'src/app/portal/_common/lib/auth-env'
import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'
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
  const userServiceClient = getUserServiceClient()

  const response = await userServiceClient.getUserByID({
    $typeName: 'zitadel.user.v2.GetUserByIDRequest',
    userId: id,
  })

  const result = schema.safeParse(response)

  if (!result.success) {
    throw new Error(`Couldn't fetch user data`)
  }

  return result.data.user
}
