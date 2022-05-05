import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/chain'
import { useMemo } from 'react'

import { getProvider } from 'functions'

import { MULTICALL_ADDRESS } from '../lib/constants'
import MULTICALL_ABI from '../abis/interface-multicall.json'
import { UniswapInterfaceMulticall } from '../typechain'

export function useMulticallContract(chainId: ChainId) {
  return useMemo(() => {
    if (!(chainId in MULTICALL_ADDRESS)) return undefined
    return new Contract(
      MULTICALL_ADDRESS[chainId] as string,
      MULTICALL_ABI,
      getProvider(chainId),
    ) as UniswapInterfaceMulticall
  }, [chainId]) as UniswapInterfaceMulticall
}
