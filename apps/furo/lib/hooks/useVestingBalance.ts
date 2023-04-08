import { Amount, Token } from '@sushiswap/currency'
import { FuroVestingChainId } from '@sushiswap/furo'
import { JSBI } from '@sushiswap/math'
import { getFuroVestingContractConfig, getBentoBoxContractConfig } from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { Address, useContractRead } from '@sushiswap/wagmi'

export function useVestingBalance(
  chainId?: FuroVestingChainId,
  vestingId?: string,
  token?: Token
): Amount<Token> | undefined {
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead({
    ...(chainId ? getFuroVestingContractConfig(chainId) : {}),
    functionName: 'vestBalance',
    chainId,
    enabled: !!chainId && !!vestingId,
    args: vestingId ? [BigNumber.from(vestingId)] : undefined,
    watch: true,
  })

  const {
    data: rebase,
    error: rebaseError,
    isLoading: rebaseLoading,
  } = useContractRead({
    ...(chainId ? getBentoBoxContractConfig(chainId) : {}),
    functionName: 'totals',
    chainId,
    enabled: !!chainId && !!token,
    args: token ? [token.address as Address] : undefined,
    watch: true,
  })

  return useMemo(() => {
    if (balanceError || rebaseError || balanceLoading || rebaseLoading || !balance || !rebase || !vestingId || !token)
      return undefined

    return Amount.fromShare(token, JSBI.BigInt(balance), {
      base: JSBI.BigInt(rebase[1]),
      elastic: JSBI.BigInt(rebase[0]),
    })
  }, [balanceError, rebaseError, balanceLoading, rebaseLoading, balance, vestingId, token, rebase])
}
