import { isSushiSwapChainId } from '@sushiswap/graph-client/data-api'
import {
  getTokenInfo,
  getTokenList,
} from '@sushiswap/graph-client/data-api/queries'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { TokenPage } from 'src/ui/token/TokenPage'
import type { EvmChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { isAddress } from 'viem'

export default async function _TokenPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isSushiSwapChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const { token, tokenInfo } = await unstable_cache(
    async () => {
      const [tokenInfoResult, tokenListResult] = await Promise.allSettled([
        getTokenInfo({ chainId, address }),
        getTokenList({ chainId, search: address }),
      ])

      if (tokenListResult.status !== 'fulfilled' || !tokenListResult.value[0]) {
        return notFound()
      }

      return {
        token: new Token(tokenListResult.value[0]),
        tokenInfo:
          tokenInfoResult.status === 'fulfilled' ? tokenInfoResult.value : null,
      }
    },
    ['token', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()

  return (
    <TokenPage
      token={
        token && typeof token.serialize === 'function'
          ? token.serialize()
          : token
      }
      tokenInfo={tokenInfo}
    />
  )
}
