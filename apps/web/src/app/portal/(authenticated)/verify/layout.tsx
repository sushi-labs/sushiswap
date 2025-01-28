import { Container } from '@sushiswap/ui'
import { redirect } from 'next/navigation'
import { getSession } from 'src/app/portal/_common/lib/client-config'
import { getUserServiceClient } from '../../(unauthenticated)/_common/lib/zitadel-client'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await getSession()

  if (!authSession.isLoggedIn || authSession.user.email.isVerified) {
    redirect('/portal')
  }

  // Check if the user verified their email in the meantime
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
    redirect('/portal/register/verify/api/set-email-verified')
  }

  return (
    <Container maxWidth="md" className="pt-16">
      {children}
    </Container>
  )
}
