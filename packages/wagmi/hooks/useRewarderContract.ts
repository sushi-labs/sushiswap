import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { useContract, useProvider } from 'wagmi'

import CLONE_REWARDER_ABI from '../abis/clone-rewarder.json'
import COMPLEX_REWARDER_ABI from '../abis/complex-rewarder.json'

export const getCloneRewarderConfig = (chainId: number, address: string | undefined = AddressZero) => ({
  addressOrName: address,
  contractInterface: CLONE_REWARDER_ABI,
})

export const getComplexRewarderConfig = (chainId: number, address: string | undefined = AddressZero) => ({
  addressOrName: address,
  contractInterface: COMPLEX_REWARDER_ABI,
})

export const getRewarderConfig = (chainId: number, address: string | undefined = AddressZero) => {
  if ([ChainId.ETHEREUM, ChainId.ARBITRUM].includes(chainId)) {
    return getCloneRewarderConfig(chainId, address)
  }

  return getComplexRewarderConfig(chainId, address)
}

export function useRewarderContract(chainId: number, address: string | undefined) {
  return useContract({
    ...getRewarderConfig(chainId, address),
    signerOrProvider: useProvider({ chainId }),
  })
}
