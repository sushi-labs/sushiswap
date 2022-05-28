import { AddressZero } from '@ethersproject/constants'
import { useContract, useProvider } from 'wagmi'

import STAKING_ABI from '../abis/Staking.json'

export function useStakingContract(chainId: number | undefined) {
  return useContract({
    addressOrName: '0x1CeD9B90aa573849b42ADAC7204860823c290dAc' ?? AddressZero,
    contractInterface: STAKING_ABI ?? [],
    signerOrProvider: useProvider({ chainId }),
  })
}
