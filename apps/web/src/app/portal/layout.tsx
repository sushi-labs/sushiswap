import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import { Suspense } from 'react'
import { getSessionData } from './_common/lib/client-config'
import { Header } from './_common/ui/header/header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Portal',
  description: 'The Sushi Labs Developer Portal.',
  icons: {
    icon: '/sushi-labs-white-icon.svg',
  },
}

async function Portal({ children }: { children: React.ReactNode }) {
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Portal>{children}</Portal>
    </Suspense>
  )
}
