import { headers } from 'next/headers'
import { EvmChainId } from 'sushi/evm'
import { Header } from '~evm/[chainId]/header'
import { GeoBlockedMessage } from './_ui/_common'
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
      <Header chainId={EvmChainId.ARBITRUM} />
      <GeoBlockedMessage isGeoBlocked={isGeoBlocked} />
      {children}
    </Providers>
  )
}
