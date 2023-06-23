'use client'

import { ChainId } from '@sushiswap/chain'
import { SushiSwapChainId, TridentChainId } from '@sushiswap/graph-config'
import { erc20ABI, getProvider } from '@sushiswap/wagmi'
import { Contract } from 'ethers'

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
