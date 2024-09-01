import '@sushiswap/ui/index.css'

import React from 'react'
import { Header } from './header'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
