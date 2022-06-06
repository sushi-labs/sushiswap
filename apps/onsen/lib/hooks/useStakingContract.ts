import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { useContract, useProvider } from 'wagmi'

import STAKING_ABI from '../../abis/Staking.json'

// TODO: remvoe this when staking contract is brought over to the monorepo
export const networks: Map<ChainId, string> = new Map([
  [ChainId.KOVAN, '0x1CeD9B90aa573849b42ADAC7204860823c290dAc'],
  [ChainId.ARBITRUM, '0x8db6749c9E8f28a4a9BbC02facb9Ba9C58e3C9c5'],
])

export function useStakingContract(chainId: number | undefined) {
  return useContract({
    addressOrName: chainId ? networks.get(chainId) ?? AddressZero : AddressZero,
    contractInterface: STAKING_ABI ?? [],
    signerOrProvider: useProvider({ chainId }),
  })
}
