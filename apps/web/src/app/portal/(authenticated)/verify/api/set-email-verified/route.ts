import { redirect } from 'next/navigation'
import { getUserServiceClient } from 'src/app/portal/(unauthenticated)/_common/lib/zitadel-client'
import { getSession } from 'src/app/portal/_common/lib/client-config'

export async function GET() {
  const authSession = await getSession()
  if (!authSession.isLoggedIn) {
    return
  }

  const userServiceClient = getUserServiceClient()
  const result = await userServiceClient.getUserByID({
    $typeName: 'zitadel.user.v2.GetUserByIDRequest',
    userId: authSession.user.id,
  })
  if (
    !result.user ||
    result.user.type.case !== 'human' ||
    !result.user.type.value.email
  ) {
    // Should only happen if the server is down
    throw new Error('Something went wrong')
  }
  if (result.user.type.value.email.isVerified) {
    authSession.user.email.isVerified = true
    await authSession.save()
  }

  redirect('/portal')
}
