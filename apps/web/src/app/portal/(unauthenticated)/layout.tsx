import { redirect } from 'next/navigation'
import { getSessionData } from '../_common/lib/client-config'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await getSessionData()

  if (authSession.isLoggedIn) {
    redirect('/portal')
  }

  return children
}
