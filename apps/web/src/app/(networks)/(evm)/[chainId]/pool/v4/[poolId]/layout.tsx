import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { isHash } from 'viem'
import { getCachedV4Pool } from './_lib/get-cached-v4-pool'

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; poolId: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return {}
  }

  const pool = await getCachedV4Pool({ chainId, poolId })

  if (!pool) {
    return {}
  }

  return {
    title: `BUY & SELL ${pool.token0.symbol}/${pool.token1.symbol}`,
  }
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  const pool = await getCachedV4Pool({ chainId, poolId })

  if (!pool) {
    return notFound()
  }

  return <>{children}</>
}
