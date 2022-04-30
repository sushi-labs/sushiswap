import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { AddressMap } from '@sushiswap/core-sdk'
import { FuroVesting } from 'furo/typechain/FuroVesting'
import { useContract, useNetwork, useSigner } from 'wagmi'
import FUROVESTING_ABI from '../abis/FuroVesting.json'

export const VESTING_ADDRESS: AddressMap = {
  [ChainId.KOVAN]: '0x24B159BF6fC4588438098323AE4c852ad37584a6',
  [ChainId.GÖRLI]: '0x08A10f7D99a8a0b53EfBFC61DE1aADEF26473061',
}

export function useFuroVestingContract(): FuroVesting | null {
  const { data: signer } = useSigner()
  const { activeChain } = useNetwork()
  const chainId = activeChain?.id
  return useContract<FuroVesting>({
    addressOrName: VESTING_ADDRESS[chainId] ?? AddressZero,
    contractInterface: FUROVESTING_ABI,
    signerOrProvider: signer,
  })
}
