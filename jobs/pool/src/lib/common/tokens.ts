import {
  SUBGRAPH_HOST,
  SUSHISWAP_SUBGRAPH_NAME,
  SushiSwapChainId,
  TRIDENT_SUBGRAPH_NAME,
  TridentChainId,
} from '@sushiswap/graph-config'
import { isSushiSwapChain, isTridentChain } from '@sushiswap/graph-config'
import { Address, erc20ABI, readContracts } from '@wagmi/core'
import { ChainId } from 'sushi/chain'

import { divBigIntToNumber } from './utils.js'

interface Token {
  id: string
  symbol: string
  name: string
  decimals: number
  liquidity: number
  derivedUSD: number
}

const getExchangeTokens = async (
  ids: string[],
  chainId: SushiSwapChainId,
): Promise<Token[]> => {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const subgraphName = SUSHISWAP_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({
    host: SUBGRAPH_HOST[chainId],
    name: subgraphName,
  })

  const { tokens, bundle } = await sdk.Tokens({
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return tokens.map((token) => ({
    id: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: Number(token.decimals),
    liquidity: Number(token.liquidity),
    derivedUSD: token.price.derivedNative * bundle?.nativePrice,
  }))
}

const getTridentTokens = async (
  ids: string[],
  chainId: TridentChainId,
): Promise<Token[]> => {
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const subgraphName = TRIDENT_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({
    host: SUBGRAPH_HOST[chainId],
    name: subgraphName,
  })

  const { tokens, bundle } = await sdk.Tokens({
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return tokens.map((token) => ({
    id: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: Number(token.decimals),
    liquidity: divBigIntToNumber(token.liquidity, token.decimals),
    derivedUSD: token.price?.derivedNative * bundle?.nativePrice,
  }))
}

export const getTokens = async (
  ids: string[],
  chainId: SushiSwapChainId | TridentChainId,
) => {
  const [exchangeTokens, tridentTokens] = await Promise.all([
    isSushiSwapChain(chainId) ? getExchangeTokens(ids, chainId) : [],
    isTridentChain(chainId) ? getTridentTokens(ids, chainId) : [],
  ])

  const betterTokens = ids
    .map((id) => {
      const exchangeToken = exchangeTokens.find(
        (token) => token.id === id.toLowerCase(),
      )
      const tridentToken = tridentTokens.find(
        (token) => token.id === id.toLowerCase(),
      )
      if (exchangeToken && tridentToken)
        return exchangeToken.liquidity > tridentToken.liquidity
          ? exchangeToken
          : tridentToken
      return exchangeToken ?? tridentToken ?? undefined
    })
    .filter((token) => token !== undefined) as Token[]

  return betterTokens
}

export async function getTokenBalancesOf(
  _tokens: string[],
  address: string,
  chainId: ChainId,
) {
  // not fully erc20, farm not active
  const tokens = _tokens.filter(
    (token) => token !== '0x0c810E08fF76E2D0beB51B10b4614b8f2b4438F9',
  )

  const balanceOfCalls = tokens.map(
    (token) =>
      ({
        address: token as Address,
        args: [address as Address],
        chainId: chainId,
        abi: erc20ABI,
        functionName: 'balanceOf',
      }) as const,
  )

  const decimalCalls = tokens.map(
    (token) =>
      ({
        address: token as Address,
        chainId: chainId,
        abi: erc20ABI,
        functionName: 'decimals',
      }) as const,
  )

  const [balancesOf, decimals] = await Promise.all([
    readContracts({
      allowFailure: true,
      contracts: balanceOfCalls,
    }),
    readContracts({
      allowFailure: true,
      contracts: decimalCalls,
    }),
  ])

  return tokens
    .map((token, i) => {
      const balance = balancesOf[i].result
      const decimal = decimals[i].result

      if (balance === null || decimal === null) {
        console.log(
          `Balance / decimal fetch failed for ${token} on ${ChainId[chainId]}`,
        )
        return null
      }

      return {
        token,
        // so that we don't need to seed new pairs
        balance: balance === 0n ? 1 : divBigIntToNumber(balance, decimal),
      }
    })
    .filter((token): token is NonNullable<typeof token> => Boolean(token))
}
