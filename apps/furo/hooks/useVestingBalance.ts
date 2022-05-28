import { AddressZero } from '@ethersproject/constants'
import { Amount, Token } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { JSBI } from '@sushiswap/math'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import BENTOBOX_ABI from 'abis/bentobox.json'
import { useMemo } from 'react'
import { useContractRead } from 'wagmi'

export function useVestingBalance(chainId?: number, vestingId?: string, token?: Token): Amount<Token> | undefined {
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      addressOrName: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.address : AddressZero,
      contractInterface: chainId ? (furoExports as any)[chainId]?.[0].contracts.FuroVesting.abi : [],
    },
    'vestBalance',
    { chainId, enabled: !!chainId && !!vestingId, args: [vestingId], watch: true }
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
    { chainId, enabled: !!chainId && !!token, args: [token?.address], watch: true }
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
