import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { FuroVesting } from '@sushiswap/furo/typechain'
import { JSBI } from '@sushiswap/math'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import BENTOBOX_ABI from 'abis/bentobox.json'
import FURO_VESTING_ABI from 'abis/FuroVesting.json'
import { useMemo } from 'react'
import { useContract, useContractRead, useProvider } from 'wagmi'

export function useFuroVestingContract(chainId?: number): FuroVesting | null {
  return useContract<FuroVesting>({
    addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero,
    contractInterface: FURO_VESTING_ABI,
    signerOrProvider: useProvider({ chainId }),
  })
}

export function useVestingBalance(chainId?: number, vestingId?: string, token?: Token): Amount<Token> | undefined {
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero,
      contractInterface: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.abi : undefined,
    },
    'vestBalance',
    { enabled: !!vestingId, args: [vestingId], watch: true, chainId }
  )

  const {
    data: rebase,
    error: rebaseError,
    isLoading: rebaseLoading,
  } = useContractRead(
    {
      addressOrName: chainId ? BENTOBOX_ADDRESS[chainId] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'totals',
    { enabled: !!token?.address, args: [token?.address], watch: true, chainId }
  )

  return useMemo(() => {
    if (balanceError || rebaseError || balanceLoading || rebaseLoading || !balance || !rebase || !vestingId || !token)
      return undefined

    return Amount.fromShare(token, JSBI.BigInt(balance), {
      base: JSBI.BigInt(rebase[0]),
      elastic: JSBI.BigInt(rebase[1]),
    })
  }, [balanceError, rebaseError, balanceLoading, rebaseLoading, balance, vestingId, token, rebase])
}
