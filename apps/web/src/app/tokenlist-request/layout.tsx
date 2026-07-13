import type React from 'react'

import { Header } from './header'
import { Providers } from './providers'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex flex-col h-full">
        <Header />
        <div className="animate-slide">{children}</div>
      </div>
    </Providers>
  )
}
