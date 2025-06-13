import { getBladePool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getPoolName } from 'src/lib/pool/blade'
import type { EvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; address: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return {}
  }

  const pool = await unstable_cache(
    async () => getBladePool({ chainId, address }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    return {}
  }

  const poolName = getPoolName(pool, { showStableCoins: false })

  return {
    title: `BUY & SELL ${poolName}`,
  }
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

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

  return <>{children}</>
}
