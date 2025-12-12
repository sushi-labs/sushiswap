import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { isEvmAddress, isSushiSwapV3ChainId } from 'sushi/evm'
import { getCachedV3Pool } from './_lib/get-cached-v3-pool'

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; address: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return {}
  }

  const pool = await getCachedV3Pool({ chainId, address })

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
  const chainId = +_chainId

  if (!isSushiSwapV3ChainId(chainId) || !isEvmAddress(address)) {
    return notFound()
  }

  const pool = await getCachedV3Pool({ chainId, address })

  if (!pool) {
    return notFound()
  }

  return <>{children}</>
}
