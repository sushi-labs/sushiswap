import { getSessionData } from './_common/lib/client-config'
import { Header } from './_common/ui/header/header'
import { Providers } from './providers'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await getSessionData()

  return (
    <Providers authSession={authSession}>
      <Header />
      {children}
    </Providers>
  )
}
