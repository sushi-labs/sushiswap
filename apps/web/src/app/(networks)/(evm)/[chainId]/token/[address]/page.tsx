import {
  type SushiSwapChainId,
  isSushiSwapChainId,
} from '@sushiswap/graph-client/data-api'
import {
  getTokenInfo,
  getTokenList,
} from '@sushiswap/graph-client/data-api/queries'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { type EvmChainId, EvmToken } from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import { TokenPage as _TokenPage } from './_ui/TokenPage'

async function getTokenData(chainId: SushiSwapChainId, address: Address) {
  const [tokenInfoResult, tokenListResult] = await Promise.allSettled([
    getTokenInfo({ chainId, address }),
    getTokenList({ chainId, search: address }),
  ])

  if (tokenListResult.status !== 'fulfilled' || !tokenListResult.value[0]) {
    return null
  }

  return {
    token: new EvmToken(tokenListResult.value[0]),
    tokenInfo:
      tokenInfoResult.status === 'fulfilled' ? tokenInfoResult.value : null,
  }
}

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; address: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isSushiSwapChainId(chainId) || !isAddress(address, { strict: false })) {
    return {}
  }

  const data = await unstable_cache(
    () => getTokenData(chainId, address),
    ['token', `${chainId}:${address}`],
    { revalidate: 60 * 15 },
  )()

  if (!data) {
    return {}
  }

  const { token, tokenInfo } = data

  return {
    title: `BUY & SELL ${token.symbol}`,
    description: tokenInfo?.description,
  }
}

export default async function TokenPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isSushiSwapChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const data = await unstable_cache(
    async () => getTokenData(chainId, address),
    ['token', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  if (!data) {
    return notFound()
  }

  const { token, tokenInfo } = data

  return (
    <_TokenPage
      token={
        token && typeof token.toJSON === 'function' ? token.toJSON() : token
      }
      tokenInfo={tokenInfo}
    />
  )
}
