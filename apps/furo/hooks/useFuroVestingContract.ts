import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { Contract } from 'ethers'
import { useContract, useNetwork, useSigner } from 'wagmi'

import FUROVESTING_ABI from '../abis/FuroVesting.json'

export const VESTING_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0x09464506e15c72D9B3dc3272Fc00757982E99E9c',
  [ChainId.GÖRLI]: '0xb449f33126a2b17526b48a962c15da0dd2d1fb44',
}

export function useFuroVestingContract(): Contract | null {
  const { data: signer } = useSigner()
  const { activeChain } = useNetwork()
  return useContract<Contract>({
    addressOrName: activeChain?.id ? VESTING_ADDRESS[activeChain?.id] : AddressZero,
    contractInterface: FUROVESTING_ABI,
    signerOrProvider: signer,
  })
}
