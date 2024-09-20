import { HotJar, classNames } from '@sushiswap/ui'
import React from 'react'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import { WagmiProvider } from 'src/providers/wagmi-provider'
import { Header } from './header'

export default function LandingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <WagmiProvider>
        <div className={classNames('flex flex-col flex-1')}>
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
        </div>
        <HotJar />
      </WagmiProvider>
    </QueryClientProvider>
  )
}
