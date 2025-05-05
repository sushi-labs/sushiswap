import { getUserServiceClient } from 'src/app/portal/_common/lib/zitadel-client'

export async function getUserById(id: string) {
  const userServiceClient = getUserServiceClient()

  const response = await userServiceClient.getUserByID({
    $typeName: 'zitadel.user.v2.GetUserByIDRequest',
    userId: id,
  })

  return response
}
