import type React from 'react'

import { headers } from 'next/headers'
import { Header } from './header'
import { Providers } from './providers'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const cookie = (await headers()).get('cookie')
  return (
    <Providers cookie={cookie}>
      <div className="flex flex-col h-full">
        <Header />
        <div className="animate-slide">{children}</div>
      </div>
    </Providers>
  )
}
