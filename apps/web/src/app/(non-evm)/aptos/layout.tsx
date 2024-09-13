import { HotJar } from '@sushiswap/ui'
import type { Metadata } from 'next'
import React from 'react'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap and permissionless market making for liquidity providers.',
}

export default function AptosLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="fixed flex flex-col h-full w-full">{children}</div>
      </Providers>
      <HotJar />
    </>
  )
}
