import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { SteerCarousel } from 'src/lib/steer/components/steer-carousel'
import type { SteerVaultPool } from 'src/lib/steer/components/steer-strategies'
import type { Hex } from 'viem'
import { getCachedVaults } from './get-cached-vaults'

export function SmartVaultsOverviewLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Container maxWidth="5xl" className="px-4">
      <CardHeader className="!p-0">
        <CardTitle>Available Strategies</CardTitle>
        <CardDescription>
          Choose one of the following strategies:
        </CardDescription>
      </CardHeader>
      {children}
    </Container>
  )
}

export async function SmartVaultsOverview({
  chainId,
  poolAddress,
  pool,
}: {
  chainId: SmartPoolChainId
  poolAddress: Hex
  pool: SteerVaultPool
}) {
  const vaults = await getCachedVaults({ chainId, poolAddress })

  return <SteerCarousel pool={pool} vaults={vaults} />
}
