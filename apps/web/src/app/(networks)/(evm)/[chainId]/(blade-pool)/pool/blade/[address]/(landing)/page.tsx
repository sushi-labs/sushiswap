import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { getCachedBladePool } from 'src/lib/pool/blade'
import { BladePoolChart } from 'src/ui/pool/blade/BladePoolChart'
import { BladePoolSourcesChart } from 'src/ui/pool/blade/BladePoolSourcesChart'
import { BladeAssetsTable } from 'src/ui/pool/blade/assets-table/BladeAssetsTable'
import { BladeHighlights } from 'src/ui/pool/blade/blade-highlights'
import { BladePoolPairsChart } from 'src/ui/pool/blade/pairs-chart'
import { BladePoolHero } from 'src/ui/pool/blade/pool-hero'
import { isBladeChainId, isEvmAddress } from 'sushi/evm'

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
      <BladePoolHero pool={pool} />
      <BladeHighlights pool={pool} />
      <div className="space-y-6 mt-16">
        <h3 className="font-medium text-gray-500 text-sm dark:text-gray-400">
          Analytics
        </h3>
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
