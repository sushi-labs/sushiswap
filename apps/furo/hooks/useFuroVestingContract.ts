import { AddressZero } from '@ethersproject/constants'
import { AddressMap, ChainId } from '@sushiswap/chain'
import { BENTOBOX_ADDRESS } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import BENTOBOX_ABI from 'abis/bentobox.json'
import FUROVESTING_ABI from 'abis/FuroVesting.json'
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { useContract, useContractRead, useNetwork, useSigner } from 'wagmi'

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

export function useVestingBalance(vestingId?: string, token?: Token): Amount<Token> | undefined {
  const { activeChain } = useNetwork()
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      addressOrName: activeChain?.id ? VESTING_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROVESTING_ABI,
    },
    'vestBalance',
    { enabled: !!vestingId, args: [vestingId], watch: true }
  )

  const {
    data: rebase,
    error: rebaseError,
    isLoading: rebaseLoading,
  } = useContractRead(
    {
      addressOrName: activeChain?.id ? BENTOBOX_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: BENTOBOX_ABI,
    },
    'totals',
    { enabled: !!token?.address, args: [token?.address], watch: true }
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
