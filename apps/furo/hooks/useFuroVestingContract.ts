import { AddressZero } from '@ethersproject/constants'
import furoExports from '@sushiswap/furo/exports.json'
import { FuroVesting } from '@sushiswap/furo/typechain'
import FURO_VESTING_ABI from 'abis/FuroVesting.json'
import { useContract, useProvider } from 'wagmi'
export function useFuroVestingContract(chainId?: number): FuroVesting | null {
  return useContract<FuroVesting>({
    addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero,
    contractInterface: FURO_VESTING_ABI,
    signerOrProvider: useProvider({ chainId }),
  })
}
