'use client'

import { ChainId } from '@sushiswap/chain'
import { Address, erc20ABI, readContracts } from '@sushiswap/wagmi'

export interface Token {
  symbol: string
  name: string
  decimals: number
}

export const getToken = async (id: Address, chainId: ChainId): Promise<Token> => {
  const result = await readContracts({
    contracts: [
      {
        address: id,
        abi: erc20ABI,
        functionName: 'symbol',
        chainId,
      },
      {
        address: id,
        abi: erc20ABI,
        functionName: 'name',
        chainId,
      },
      {
        address: id,
        abi: erc20ABI,
        functionName: 'decimals',
        chainId,
      },
    ] as const,
    allowFailure: false,
  })

  const [symbol, name, decimals] = [result[0], result[1], result[2]]
  return { symbol, name, decimals }
}
