import type React from 'react'
import { Header } from 'src/app/(networks)/_ui/header/header'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { TvmChainId } from 'sushi/tvm'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header
        chainId={TvmChainId.TRON}
        supportedNetworks={POOL_SUPPORTED_NETWORKS}
      />
      <main className="flex flex-col h-full flex-1 animate-slide">
        {children}
      </main>
    </>
  )
}
