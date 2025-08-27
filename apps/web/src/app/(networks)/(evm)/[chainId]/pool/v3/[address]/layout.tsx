import { getV3Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import type { EvmChainId } from 'sushi/chain'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { isAddress } from 'viem'

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; address: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return {}
  }

  const pool = await unstable_cache(
    async () => getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    return {}
  }

  return {
    title: `BUY & SELL ${pool.token0.symbol}/${pool.token1.symbol}`,
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

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = await unstable_cache(
    async () => getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!pool) {
    return notFound()
  }

  return <>{children}</>
}
