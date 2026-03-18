import { Container, Message } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { getCachedBladePool } from 'src/lib/pool/blade'
import { isBladeChainId, isEvmAddress } from 'sushi/evm'
import { BladeSunsetNotice } from '~evm/[chainId]/_ui/blade-sunset-notice'
import { BladeAssetsTable } from './_ui/blade-assets-table'
import { BladeHighlights } from './_ui/blade-highlights'
import { BladePoolPairsChart } from './_ui/blade-pair-chart'
import { BladePoolChart } from './_ui/blade-pool-chart'
import { BladePoolHero } from './_ui/blade-pool-hero'
import { BladePoolSourcesChart } from './_ui/blade-pool-sources-chart'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isBladeChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = await getCachedBladePool(chainId, address)

  if (!pool) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="flex flex-col px-4">
      <BladeSunsetNotice className="mb-4" />

      <BladePoolHero pool={pool} />
      <BladeHighlights pool={pool} />
      <div className="space-y-6 mt-16">
        <h3 className="font-medium text-muted-foreground text-sm">Analytics</h3>
        <BladeAssetsTable pool={pool} />
        <BladePoolChart pool={pool} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BladePoolPairsChart
            poolAddress={pool.address}
            chainId={pool.chainId}
          />
          <BladePoolSourcesChart
            poolAddress={pool.address}
            chainId={pool.chainId}
          />
        </div>
      </div>
    </Container>
  )
}
