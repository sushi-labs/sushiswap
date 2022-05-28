import { AddressZero } from '@ethersproject/constants'
import bentoBoxArtifact from '@sushiswap/bentobox/artifacts/contracts/BentoBox.sol/BentoBox.json'
import { Amount, Token } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { JSBI } from '@sushiswap/math'
import { BENTOBOX_ADDRESS } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { useContractRead } from 'wagmi'
export function useVestingBalance(chainId?: number, vestingId?: string, token?: Token): Amount<Token> | undefined {
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useContractRead(
    {
      addressOrName:
        furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.address ??
        AddressZero,
      contractInterface:
        furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.abi ?? [],
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
      contractInterface: bentoBoxArtifact.abi,
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
