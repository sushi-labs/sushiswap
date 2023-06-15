import React from 'react'
import { Header } from './header'
import { Providers } from './providers'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black">
      <Providers>
        <Header />
        {children}
      </Providers>
    </div>
  )
}
