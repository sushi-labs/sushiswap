import { HotJar } from '@sushiswap/ui/components/scripts'
import React from 'react'

import { Header } from './header'
import { Providers } from './providers'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col flex-1 bg-slate-950">
        <Providers>
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
        </Providers>
      </div>
      <HotJar />
    </>
  )
}
