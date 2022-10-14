import { ChainId } from '@sushiswap/chain'
import { Native } from '@sushiswap/currency'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'
import { erc20ABI, readContracts } from 'wagmi'

const apiKey = process.env.ALCHEMY_ID as string

createClient(configureChains([...allChains, ...otherChains], [publicProvider(), alchemyProvider({ apiKey })]))

interface TokenKPI {
  priceUSD: number
  liquidity: number
  liquidityUSD: number
  volumeUSD: number
}

export const getExchangeTokenKPI = async (id: string, chainId: ChainId): Promise<TokenKPI> => {
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

export const getTridentTokenKPI = async (id: string, chainId: ChainId): Promise<TokenKPI> => {
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
  const results: [string, string, number] = await readContracts({
    allowFailure: true,
    contracts: [
      {
        addressOrName: id,
        chainId,
        contractInterface: erc20ABI,
        functionName: 'symbol',
      },
      {
        addressOrName: id,
        chainId,
        contractInterface: erc20ABI,
        functionName: 'name',
      },
      {
        addressOrName: id,
        chainId,
        contractInterface: erc20ABI,
        functionName: 'decimals',
      },
    ],
  })
  return { symbol: results[0], name: results[1], decimals: results[2] }
}
