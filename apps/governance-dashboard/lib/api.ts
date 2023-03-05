import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import {
  EXCHANGE_SUBGRAPH_NAME,
  GRAPH_HOST,
  SushiSwapChainId,
  TRIDENT_SUBGRAPH_NAME,
  TridentChainId,
} from '@sushiswap/graph-config'
import { isSushiSwapChain, isTridentChain } from '@sushiswap/validate'
import { getProvider } from '@sushiswap/wagmi'
import { Contract } from 'ethers'
import { erc20ABI } from 'wagmi'

interface TokenKPI {
  priceUSD: number
  liquidity: number
  liquidityUSD: number
  volumeUSD: number
}

export const getExchangeTokenKPI = async (id: string, chainId: SushiSwapChainId): Promise<TokenKPI | undefined> => {
  const [subgraphHost, subgraphName] = [GRAPH_HOST[chainId], EXCHANGE_SUBGRAPH_NAME[chainId]]

  if (!subgraphHost || !subgraphName) return

  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: subgraphHost, name: subgraphName })

  const { Exchange_token: token, Exchange_bundle: bundle } = await sdk.ExchangeToken({ id: id.toLowerCase() })

  if (!token || !bundle) return

  return {
    priceUSD: token.derivedETH * bundle.ethPrice,
    liquidity: Number(token.liquidity),
    liquidityUSD: token.liquidity * token.derivedETH * bundle.ethPrice,
    volumeUSD: Number(token.volumeUSD),
  }
}

export const getTridentTokenKPI = async (id: string, chainId: TridentChainId): Promise<TokenKPI | undefined> => {
  const [subgraphHost, subgraphName] = [GRAPH_HOST[chainId], TRIDENT_SUBGRAPH_NAME[chainId]]

  if (!subgraphHost || !subgraphName) return

  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: subgraphHost, name: subgraphName })

  const { Trident_token: token, Trident_bundle: bundle } = await sdk.TridentToken({
    id: id.toLowerCase(),
    native: Native.onChain(chainId).wrapped.address.toLowerCase(),
  })

  if (!token || !bundle) return

  return {
    priceUSD: token.price.derivedNative * bundle.nativePrice,
    liquidity: Number(token.liquidity),
    liquidityUSD: token.liquidity * token.price.derivedNative * bundle.nativePrice,
    volumeUSD: Number(token.volumeUSD),
  }
}

export const getTokenKPI = async (
  id: string,
  chainId: SushiSwapChainId | TridentChainId
): Promise<TokenKPI | undefined> => {
  const [exchangeToken, tridentToken] = await Promise.all([
    isSushiSwapChain(chainId) ? getExchangeTokenKPI(id, chainId) : undefined,
    isTridentChain(chainId) ? getTridentTokenKPI(id, chainId) : undefined,
  ])

  if (exchangeToken && tridentToken) {
    if (exchangeToken.liquidity > tridentToken.liquidity) {
      return exchangeToken
    } else {
      return tridentToken
    }
  }

  return exchangeToken ?? tridentToken ?? undefined
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
