import { getBladePool } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { BladePoolChart } from 'src/ui/pool/blade/BladePoolChart'
import { BladePoolSourcesChart } from 'src/ui/pool/blade/BladePoolSourcesChart'
import { BladeAssetsTable } from 'src/ui/pool/blade/assets-table/BladeAssetsTable'
import { BladeHighlightsTabs } from 'src/ui/pool/blade/highlight-tabs/BladeHighlightsTabs'
import { BladePoolPairsChart } from 'src/ui/pool/blade/pairs-chart'
import { BladePoolHero } from 'src/ui/pool/blade/pool-hero'

import type { EvmChainId } from 'sushi'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = await unstable_cache(
    async () => getBladePool({ chainId, address }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    return notFound()
  }

  return (
    <Container maxWidth="7xl" className="flex flex-col gap-6 px-4">
      <BladePoolHero pool={pool} />
      <BladeHighlightsTabs pool={pool} />
      <h3 className="font-medium text-gray-500 text-sm dark:text-gray-400">
        Analytics
      </h3>
      <BladeAssetsTable pool={pool} />
      <BladePoolChart pool={pool} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <BladePoolPairsChart
          poolAddress={pool.address}
          chainId={pool.chainId}
        />
        <BladePoolSourcesChart
          poolAddress={pool.address}
          chainId={pool.chainId}
        />
      </div>
    </Container>
  )
}
