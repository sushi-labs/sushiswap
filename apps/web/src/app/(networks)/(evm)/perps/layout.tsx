import { Suspense } from 'react'
import { EvmChainId } from 'sushi/evm'
import { PerpsFooter, PerpsHeader } from './_ui/_common'
import { Providers } from './providers'

export default async function PerpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <Providers>
        <PerpsHeader chainId={EvmChainId.ARBITRUM} />
        {children}
        <PerpsFooter />
      </Providers>
    </Suspense>
  )
}
