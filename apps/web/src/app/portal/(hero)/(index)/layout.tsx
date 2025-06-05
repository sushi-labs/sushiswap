import { getSessionData } from '../../_common/lib/client-config'

export default async function Layout({
  login,
  user,
}: {
  login: React.ReactNode
  user: React.ReactNode
}) {
  const session = await getSessionData()

  if (session.isLoggedIn) {
    return user
  }

  return login
}
