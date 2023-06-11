import './globals.css'
import './variables.css'

import React from 'react'
import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Sushi 🍣',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      {children}
    </Providers>
  )
}
