import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { Contract } from 'ethers'
import { useContract, useNetwork, useSigner } from 'wagmi'

import FUROVESTING_ABI from '../abis/FuroVesting.json'

export const VESTING_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0xc3c4a93f58c499ce025d4586aff8c3a5c4b11be8',
  [ChainId.GÖRLI]: '0x4dc1fae47ef7a44f5f42bca3480228c915fa2ddf',
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
