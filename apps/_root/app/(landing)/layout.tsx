import React from 'react'
import { Header } from './header'
import { Providers } from './providers'
import { HotJar } from '@sushiswap/ui/components/scripts'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-black">
        <Providers>
          <Header />
          {children}
        </Providers>
      </div>
      <HotJar />
    </>
  )
}
