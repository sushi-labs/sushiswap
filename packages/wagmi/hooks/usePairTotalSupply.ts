import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'
import { useContractRead } from 'wagmi'

import { uniswapV2PairAbi } from '../abis'

export const usePairTotalSupply = (address: string | undefined, chainId: ChainId) => {
  const { data: totalSupply } = useContractRead({
    address: address ?? '',
    abi: uniswapV2PairAbi,
    functionName: 'totalSupply',
    chainId,
  })

  return useMemo(() => {
    if (address && totalSupply) {
      const slp = new Token({
        address,
        name: 'SLP Token',
        decimals: 18,
        symbol: 'SLP',
        chainId,
      })

      return Amount.fromRawAmount(slp, totalSupply.toString())
    }
  }, [address, chainId, totalSupply])
}
