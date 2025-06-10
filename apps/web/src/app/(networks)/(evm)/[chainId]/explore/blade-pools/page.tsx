import { getBladePools } from '@sushiswap/graph-client/data-api'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { BladePoolsTable } from 'src/ui/pool/blade/BladePoolsTable'
import { BladeFeaturedPoolBanner } from 'src/ui/pool/blade/featured-pool-banner'
import type { EvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'

export default async function BladePoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId as EvmChainId

  if (!isBladeChainId(chainId)) {
    return notFound()
  }

  const pools = await getBladePools({ chainId })
  const activePools = pools.filter((pool) => !pool.isDeprecated)

  const featuredPool =
    activePools.length > 0
      ? activePools.reduce((prev, current) =>
          current.liquidityUSD > prev.liquidityUSD ? current : prev,
        )
      : null

  return (
    <Container maxWidth="7xl" className="space-y-6 px-4">
      {featuredPool && <BladeFeaturedPoolBanner pool={featuredPool} />}
      <BladePoolsTable pools={activePools} />
    </Container>
  )
}
