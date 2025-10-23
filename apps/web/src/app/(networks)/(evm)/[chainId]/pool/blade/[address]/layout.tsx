import { getBladePool } from '@sushiswap/graph-client/data-api'
import ms from 'ms'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { type EvmChainId, isBladeChainId } from 'sushi/evm'
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
    async () => getBladePool({ chainId, address }, { retries: 3 }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: ms('15m'),
    },
  )()

  if (!pool) {
    return {}
  }

  return {
    title: `BUY & SELL ${pool.tokens[0]?.token.symbol}/${pool.tokens[1]?.token.symbol}`,
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

  return <>{children}</>
}
