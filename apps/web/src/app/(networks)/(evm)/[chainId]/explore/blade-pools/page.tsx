import { getBladePools } from '@sushiswap/graph-client/data-api-blade-prod'
import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { isPublicBladeChainId } from 'src/config.server'
import { type BladeChainId, EvmChainId, isBladeChainId } from 'sushi/evm'
import { BladeFeaturedPoolBanner } from '../_ui/blade-featured-pool-banner'
import { BladePoolsTable } from './_ui/blade-pool-table'

/**
 * These pools have been created but won't have any liquidity yet.
 */
const EXCLUDED_POOLS: Partial<Record<BladeChainId, string[]>> = {
  [EvmChainId.KATANA]: ['0x2e32c76b4f50698f96fdd8ff4af0bd5d45f9399d'],
}

export default async function BladePoolsPage(props: {
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const chainId = +params.chainId

  if (!isBladeChainId(chainId) || !(await isPublicBladeChainId(chainId))) {
    return notFound()
  }

  const pools = await getBladePools({ chainId })
  const bladeAbis: (typeof pools)[number]['abi'][] = [
    'BladeVerifiedExchange',
    'BladeApproximateCaravelExchange',
  ]
  const activePools = pools.filter(
    (pool) =>
      !pool.isDeprecated &&
      !EXCLUDED_POOLS[chainId]?.includes(pool.address.toLowerCase()),
  )
  const bladePools = activePools.filter((pool) => bladeAbis.includes(pool.abi))
  // if there are any Blade pools, only display them, otherwise display Clipper pools
  const poolsToDisplay = bladePools.length > 0 ? bladePools : activePools

  const featuredPool =
    poolsToDisplay.length > 0
      ? poolsToDisplay.reduce((prev, current) =>
          current.liquidityUSD > prev.liquidityUSD ? current : prev,
        )
      : null

  return (
    <Container maxWidth="7xl" className="space-y-6 px-4">
      {featuredPool && <BladeFeaturedPoolBanner pool={featuredPool} />}
      <BladePoolsTable pools={poolsToDisplay} />
    </Container>
  )
}
