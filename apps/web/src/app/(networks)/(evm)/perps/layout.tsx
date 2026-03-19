import { EvmChainId } from 'sushi/evm'
import { GeoBlockedMessage } from './_ui/_common'
import { PerpsHeader } from './_ui/_common/perps-header'
import { Providers } from './providers'

export default async function PerpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <PerpsHeader chainId={EvmChainId.ARBITRUM} />
      <GeoBlockedMessage />
      {children}
    </Providers>
  )
}
