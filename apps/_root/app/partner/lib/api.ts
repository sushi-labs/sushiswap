'use client'

import { ChainId } from '@sushiswap/chain'
import { SushiSwapChainId, TridentChainId } from '@sushiswap/graph-config'
import { getProvider } from '@sushiswap/wagmi'
import { Contract } from 'ethers'
import { erc20ABI } from '@sushiswap/wagmi'

interface TokenKPI {
  priceUSD: number
  liquidity: number
  liquidityUSD: number
  volumeUSD: number
}

export const getTokenKPI = async (
  id: string,
  chainId: SushiSwapChainId | TridentChainId
): Promise<TokenKPI | undefined> => {
  // const { getBuiltGraphSDK } = await import('@sushiswap/graph-client')
  // const sdk = getBuiltGraphSDK()
  // const [
  //   { crossChainToken },
  //   {
  //     bundles: [bundle],
  //   },
  // ] = await Promise.all([
  //   sdk.CrossChainToken({
  //     id: id.toLowerCase(),
  //     chainId,
  //     now: 0,
  //   }),
  //   sdk.Bundles({ chainIds: [chainId] }),
  // ])
  // if (!crossChainToken || !bundle) return
  // return {
  //   priceUSD: crossChainToken.price.derivedNative * bundle.nativePrice,
  //   liquidity: crossChainToken.liquidityUSD / (crossChainToken.price.derivedNative * bundle.nativePrice),
  //   liquidityUSD: crossChainToken.liquidityUSD,
  //   volumeUSD: Number(crossChainToken.volumeUSD),
  // }

  return
}

export interface Token {
  symbol: string
  name: string
  decimals: number
}

export const getToken = async (id: string, chainId: ChainId): Promise<Token> => {
  const token = new Contract(id, erc20ABI, getProvider({ chainId }))

  const [symbol, name, decimals] = await Promise.all([token.symbol(), token.name(), token.decimals()])

  return { symbol, name, decimals }
}
