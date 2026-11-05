'use client'

import { useCallback, useMemo } from 'react'
import type { Amount } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  type EvmToken,
  PERMIT2_ADDRESS,
  type Permit2PermitBatch,
  type Permit2PermitDetails,
  getPermit2PermitBatchTypedData,
  permit2Abi_allowance,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { useReadContracts, useSignTypedData } from 'wagmi'

/** A signed Permit2 `permitBatch`, ready to forward to the spender. */
export interface Permit2PermitBatchSignature {
  owner: EvmAddress
  permitBatch: Permit2PermitBatch
  signature: Hex
}

/** The amounts in `amounts` Permit2 has to move: non-zero ERC20s. */
export function getPermit2TokenAmounts(
  amounts: readonly Amount<EvmCurrency>[],
): Amount<EvmToken>[] {
  return amounts.filter(
    (amount): amount is Amount<EvmToken> =>
      amount.currency.type === 'token' && amount.amount > 0n,
  )
}

interface UsePermit2PermitBatchParams {
  chainId: EvmChainId
  owner: EvmAddress | undefined
  spender: EvmAddress
  /** The most of each currency the call may pull; native ones are skipped. */
  amounts: readonly Amount<EvmCurrency>[]
  /** Unix seconds the permit's allowance and signature stay valid until. */
  deadline: bigint | undefined
}

interface UsePermit2PermitBatchResult {
  /** Undefined while the allowances or the deadline load, or if they failed. */
  isPermitRequired: boolean | undefined
  /** Reading the allowances failed; `refetch` retries. */
  isError: boolean
  refetch: ReturnType<typeof useReadContracts>['refetch']
  /**
   * Asks for a `permitBatch` signature granting what Permit2 allowances lack;
   * undefined if nothing is. Sign right before sending the transaction, whose
   * deadline must not pass the signature's.
   */
  sign(): Promise<Permit2PermitBatchSignature | undefined>
  isSigning: boolean
}

/**
 * The Permit2 allowances `spender` needs from `owner` for `amounts`, and a
 * signature granting them. Permits cover exactly the amounts and expire at
 * `deadline`, mirroring one-time ERC20 approvals. The ERC20 approvals of
 * Permit2 itself are the caller's, e.g. through `Checker.ApproveERC20Multiple`.
 */
export function usePermit2PermitBatch({
  chainId,
  owner,
  spender,
  amounts,
  deadline,
}: UsePermit2PermitBatchParams): UsePermit2PermitBatchResult {
  const tokenAmounts = useMemo(() => getPermit2TokenAmounts(amounts), [amounts])

  const allowances = useReadContracts({
    allowFailure: false,
    contracts: owner
      ? tokenAmounts.map(
          (amount) =>
            ({
              chainId,
              address: PERMIT2_ADDRESS,
              abi: permit2Abi_allowance,
              functionName: 'allowance',
              args: [owner, amount.currency.address, spender],
            }) as const,
        )
      : [],
    query: { enabled: Boolean(owner && tokenAmounts.length) },
  })

  const required = useMemo((): Permit2PermitDetails[] | undefined => {
    if (!tokenAmounts.length) return []
    if (!deadline || !allowances.data) return undefined

    return tokenAmounts.flatMap((amount, i) => {
      const [allowed, expiration, nonce] = allowances.data[i]!
      // An allowance must outlive the transaction it is spent in
      if (allowed >= amount.amount && BigInt(expiration) >= deadline) return []

      return [
        {
          token: amount.currency.address,
          amount: amount.amount,
          expiration: Number(deadline),
          nonce,
        },
      ]
    })
  }, [allowances.data, deadline, tokenAmounts])

  const { signTypedDataAsync, isPending } = useSignTypedData()

  const sign = useCallback(async () => {
    if (!owner || !required || !deadline)
      throw new Error('The Permit2 allowances have not loaded')
    if (!required.length) return undefined

    const permitBatch: Permit2PermitBatch = {
      details: required,
      spender,
      sigDeadline: deadline,
    }
    const signature = await signTypedDataAsync({
      account: owner,
      ...getPermit2PermitBatchTypedData({ chainId, permitBatch }),
    })
    return { owner, permitBatch, signature }
  }, [chainId, deadline, owner, required, signTypedDataAsync, spender])

  return {
    isPermitRequired: required === undefined ? undefined : required.length > 0,
    isError: allowances.isError,
    refetch: allowances.refetch,
    sign,
    isSigning: isPending,
  }
}
