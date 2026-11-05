import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import type { Metadata } from 'next/types'
import type { ReactElement, ReactNode } from 'react'
import { isHash } from 'viem'
import { getCachedV4Pool, getV4PoolOrNotFound } from './_lib/get-cached-v4-pool'

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
  children: ReactNode
  params: Promise<{ chainId: string; poolId: string }>
}): Promise<ReactElement> {
  await getV4PoolOrNotFound(props.params)
  return <>{props.children}</>
}
