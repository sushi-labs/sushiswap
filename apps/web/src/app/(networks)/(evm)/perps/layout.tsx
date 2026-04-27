import { EvmChainId } from 'sushi/evm'
import { PerpsFooter, PerpsHeader } from './_ui/_common'
import { Providers } from './providers'

export default async function PerpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <PerpsHeader chainId={EvmChainId.ARBITRUM} />
      {children}
      <PerpsFooter />
    </Providers>
  )
}
