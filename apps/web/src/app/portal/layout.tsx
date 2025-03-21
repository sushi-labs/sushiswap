import NextTopLoader from 'nextjs-toploader'
import { getSessionData } from './_common/lib/client-config'
import { Header } from './_common/ui/header/header'
import { Providers } from './providers'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const authSession = await getSessionData()

  return (
    <Providers authSession={authSession}>
      <div className="fixed flex flex-col h-full w-full">
        <Header />
        <NextTopLoader showSpinner={false} />
        {children}
      </div>
    </Providers>
  )
}
