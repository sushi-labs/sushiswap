import { headers } from 'next/headers'
import { EvmChainId } from 'sushi/evm'
import { GeoBlockedMessage } from './_ui/_common'
import { PerpsHeader } from './_ui/_common/perps-header'
import { Providers } from './providers'

export default async function PerpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerz = await headers()
  const isGeoBlocked = headerz.has('x-perps-region-blocked')
  return (
    <Providers>
      <PerpsHeader chainId={EvmChainId.ARBITRUM} />
      <GeoBlockedMessage isGeoBlocked={isGeoBlocked} />
      {children}
    </Providers>
  )
}
