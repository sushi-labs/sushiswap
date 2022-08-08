import { ChainId } from '@sushiswap/chain'
import { getProvider } from '@sushiswap/wagmi'
import { EXCHANGE, GRAPH_HOST } from 'config'
import { Contract } from 'ethers'
import { erc20ABI } from 'wagmi'

export const getBundle = async (chainId: ChainId) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: EXCHANGE[chainId] })

  const { bundles } = await sdk.Bundle()

  return bundles?.[0]
}

export const getTokenKPI = async (id: string, chainId: ChainId) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: GRAPH_HOST[chainId], name: EXCHANGE[chainId] })

  const [{ token }, { ethPrice }] = await Promise.all([sdk.Token({ id: id.toLowerCase() }), getBundle(chainId)])

  return {
    ...token,
    derivedUSD: token.derivedETH * ethPrice,
    liquidityUSD: token.derivedETH * token.liquidity * ethPrice,
  }
}

export interface Token {
  symbol: string
  name: string
  decimals: number
}

export const getToken = async (id: string, chainId: ChainId): Promise<Token> => {
  const token = new Contract(id, erc20ABI, getProvider(chainId))

  const [symbol, name, decimals] = await Promise.all([token.symbol(), token.name(), token.decimals()])

  return { symbol, name, decimals }
}
