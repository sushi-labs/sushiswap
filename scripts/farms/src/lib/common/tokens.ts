import { ChainId } from '@sushiswap/chain'
import { ERC20 } from '@sushiswap/core'
import { SUBGRAPH_HOST, SUSHISWAP_SUBGRAPH_NAME, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { erc20ABI, readContracts, ReadContractsConfig } from '@wagmi/core'

import { divBigNumberToNumber } from './utils'

interface Token {
  id: string
  symbol: string
  decimals: number
  liquidity: number
  derivedUSD: number
}

const getExchangeTokens = async (ids: string[], chainId: ChainId): Promise<Token[]> => {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = SUSHISWAP_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: SUBGRAPH_HOST[chainId], name: subgraphName })

  // waiting for new subgraph to sync
  const { tokens, bundle } = await sdk.Tokens({ where: { id_in: ids.map((id) => id.toLowerCase()) } })

  return tokens.map((token) => ({
    id: token.id,
    symbol: token.symbol,
    decimals: Number(token.decimals),
    liquidity: Number(token.liquidity),
    derivedUSD: token.price.derivedNative * bundle?.nativePrice,
  }))
}

const getTridentTokens = async (ids: string[], chainId: ChainId): Promise<Token[]> => {
  const { getBuiltGraphSDK } = await import('../../../.graphclient')
  const subgraphName = TRIDENT_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return []
  const sdk = getBuiltGraphSDK({ host: SUBGRAPH_HOST[chainId], name: subgraphName })

  const { tokens, bundle } = await sdk.Tokens({
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return tokens.map((token) => ({
    id: token.id,
    symbol: token.symbol,
    decimals: Number(token.decimals),
    liquidity: divBigNumberToNumber(token.liquidity, token.decimals),
    derivedUSD: token.price?.derivedNative * bundle?.nativePrice,
  }))
}

export const getTokens = async (ids: string[], chainId: ChainId) => {
  const [exchangeTokens, tridentTokens] = await Promise.all([
    getExchangeTokens(ids, chainId),
    getTridentTokens(ids, chainId),
  ])

  const betterTokens = ids
    .map((id) => {
      const exchangeToken = exchangeTokens.find((token) => token.id === id.toLowerCase())
      const tridentToken = tridentTokens.find((token) => token.id === id.toLowerCase())
      if (exchangeToken && tridentToken)
        return exchangeToken.liquidity > tridentToken.liquidity ? exchangeToken : tridentToken
      return exchangeToken ?? tridentToken ?? undefined
    })
    .filter((token) => token !== undefined) as Token[]

  return betterTokens
}

export async function getTokenBalancesOf(tokens: string[], address: string, chainId: ChainId) {
  const balanceOfCalls: ReadContractsConfig['contracts'] = tokens.map((token) => ({
    addressOrName: token,
    args: [address],
    chainId: chainId,
    contractInterface: erc20ABI,
    functionName: 'balanceOf',
  }))

  const decimalCalls: ReadContractsConfig['contracts'] = tokens.map((token) => ({
    addressOrName: token,
    chainId: chainId,
    contractInterface: erc20ABI,
    functionName: 'decimals',
  }))

  const result = await readContracts({
    allowFailure: true,
    contracts: [...balanceOfCalls, ...decimalCalls],
  })

  const balancesOf = result.splice(0, balanceOfCalls.length) as unknown as Awaited<ReturnType<ERC20['balanceOf']>>[]
  const decimals = result.splice(0, decimalCalls.length) as unknown as number[]

  return tokens.map((token, i) => ({
    token,
    balance: divBigNumberToNumber(balancesOf[i], decimals[i]),
  }))
}
