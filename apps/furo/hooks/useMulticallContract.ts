import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/chain'
import { useMemo } from 'react'

import { getProvider } from '../functions/getProvider'

import { MULTICALL_ADDRESS } from '../lib/constants'
import MULTICALL_ABI from '../abis/interface-multicall.json'
import { UniswapInterfaceMulticall } from '../typechain/types'

export function useMulticallContract(chainId: ChainId) {
  return useMemo(() => {
    return new Contract(MULTICALL_ADDRESS[chainId], MULTICALL_ABI, getProvider(chainId)) as UniswapInterfaceMulticall
  }, [chainId]) as UniswapInterfaceMulticall
}
