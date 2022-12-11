import '@sushiswap/ui13/index.css'

import RootLayout from '@sushiswap/ui13/components/RootLayout'
import React from 'react'

import { Header } from '../ui/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout>
      <Header />
      {children}
    </RootLayout>
  )
}
