import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { getProvider } from '@sushiswap/wagmi'
import { EXCHANGE, GRAPH_HOST, TRIDENT } from 'config'
import { Contract } from 'ethers'
import { erc20ABI } from 'wagmi'

interface TokenKPI {
  priceUSD: number
  liquidity: number
  liquidityUSD: number
  volumeUSD: number
}

export const getExchangeTokenKPI = async (id: string, chainId: ChainId): Promise<TokenKPI> => {
  const [subgraphHost, subgraphName] = [GRAPH_HOST[chainId], EXCHANGE[chainId]]

  if (!subgraphHost || !subgraphName) return

  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: subgraphHost, name: subgraphName })

  const {
    Exchange_token: token,
    Exchange_bundles: [bundle],
  } = await sdk.ExchangeToken({ id: id.toLowerCase() })

  if (!token || !bundle) return

  return {
    priceUSD: token.derivedETH * bundle.ethPrice,
    liquidity: Number(token.liquidity),
    liquidityUSD: token.liquidity * token.derivedETH * bundle.ethPrice,
    volumeUSD: Number(token.volumeUSD),
  }
}

export const getTridentTokenKPI = async (id: string, chainId: ChainId): Promise<TokenKPI> => {
  const [subgraphHost, subgraphName] = [GRAPH_HOST[chainId], TRIDENT[chainId]]

  if (!subgraphHost || !subgraphName) return

  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK({ host: subgraphHost, name: subgraphName })

  const { Trident_token: token, native } = await sdk.TridentToken({
    id: id.toLowerCase(),
    native: Native.onChain(chainId).wrapped.address.toLowerCase(),
  })

  if (!token || !native) return

  return {
    priceUSD: token.price.derivedNative * native.derivedUSD,
    liquidity: Number(token.kpi.liquidity),
    liquidityUSD: token.kpi.liquidity * token.price.derivedNative * native.derivedUSD,
    volumeUSD: Number(token.kpi.volumeUSD),
  }
}

export const getTokenKPI = async (id: string, chainId: ChainId): Promise<TokenKPI> => {
  const [exchangeToken, tridentToken] = await Promise.all([
    getExchangeTokenKPI(id, chainId),
    getTridentTokenKPI(id, chainId),
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
