import { Interface } from '@ethersproject/abi'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import { useContractRead } from 'wagmi'

const PAIR_INTERFACE = new Interface(IUniswapV2PairArtifact.abi)

export const usePairTotalSupply = (address: string | undefined, chainId: ChainId) => {
  const { data: totalSupply } = useContractRead({
    addressOrName: address ?? '',
    contractInterface: PAIR_INTERFACE,
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
