import { Metadata } from 'next'
import React from 'react'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap, cross chain swap, streaming, vesting, and permissionless market making for liquidity providers.',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="fixed flex flex-col h-full w-full">{children}</div>
    </Providers>
  )
}
