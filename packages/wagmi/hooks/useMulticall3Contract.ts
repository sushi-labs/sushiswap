import { otherChains } from '@sushiswap/wagmi-config'
import { Address, allChains, useContract, useProvider } from 'wagmi'

import { multicall3Abi } from '../abis'

const chains = [...allChains, ...otherChains]

export const getMulticall3ContractConfig = (chainId: number | undefined) => ({
  address: (chains.find((chain) => chain.id === chainId)?.multicall?.address || '') as Address,
  abi: multicall3Abi,
})

export function useMulticall3Contract(chainId: number): ReturnType<typeof useContract> {
  return useContract({
    ...getMulticall3ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
