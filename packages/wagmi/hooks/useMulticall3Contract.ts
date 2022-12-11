import { allChains } from '@sushiswap/wagmi-config'
import { Address, useContract, useProvider } from 'wagmi'

import { multicall3Abi } from '../abis'

type Multicall3ChainId = typeof allChains[number]['id']

export const getMulticall3ContractConfig = (chainId: Multicall3ChainId | undefined) => ({
  address: (allChains.find((chain) => chain?.id === chainId)?.contracts?.multicall3?.address || '') as Address,
  abi: multicall3Abi,
})

export function useMulticall3Contract(chainId: Multicall3ChainId): ReturnType<typeof useContract> {
  return useContract({
    ...getMulticall3ContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
