import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { useContract, useProvider } from 'wagmi'

import STAKING_ABI from '../../abis/Staking.json'

// TODO: remvoe this when staking contract is brought over to the monorepo
export const networks: Map<ChainId, string> = new Map([
  [ChainId.KOVAN, '0x1CeD9B90aa573849b42ADAC7204860823c290dAc'],
  [ChainId.ARBITRUM, '0x9fA4A9F3815Dc4ee4d55a0B3290e6D297cDbfF72'],
])

export function useStakingContract(chainId: number | undefined) {
  return useContract({
    addressOrName: chainId ? networks.get(chainId) ?? AddressZero : AddressZero,
    contractInterface: STAKING_ABI ?? [],
    signerOrProvider: useProvider({ chainId }),
  })
}
