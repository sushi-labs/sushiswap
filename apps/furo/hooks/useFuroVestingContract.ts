import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { Contract } from 'ethers'
import { useContract, useNetwork, useSigner } from 'wagmi'

import FUROVESTING_ABI from '../abis/FuroVesting.json'

export const VESTING_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0x00e9eb7743aa4a79a804363ae2afa308feff70c3',
  [ChainId.GÖRLI]: '0x23645e242ace2b84a7703cd5ece3c93b1e5cb5ed',
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
