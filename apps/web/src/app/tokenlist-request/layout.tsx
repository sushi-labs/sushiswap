import { connection } from 'next/server'
import type React from 'react'
import { Suspense } from 'react'

import { Header } from './header'

async function TokenlistRequest({ children }: { children: React.ReactNode }) {
  await connection()
  const { Providers } = await import('./providers')

  return (
    <Providers>
      <div className="flex flex-col h-full">
        <Header />
        <div className="animate-slide">{children}</div>
      </div>
    </Providers>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TokenlistRequest>{children}</TokenlistRequest>
    </Suspense>
  )
}
