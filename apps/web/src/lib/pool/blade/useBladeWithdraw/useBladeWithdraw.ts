'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { Abi, AbiStateMutability, Hex } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import type { WriteContractVariables } from 'wagmi/query'
import type { WithdrawVariablesGetterArgs } from './types'
import { bladeWithdraw } from './variables/bladeWithdraw'
import { clipperV0Withdraw } from './variables/clipperV0Withdraw'
import { clipperWithdraw } from './variables/clipperWithdraw'

const withdrawWriteVariablesMap: Record<
  BladePool['abi'],
  (
    args: WithdrawVariablesGetterArgs,
  ) => WriteContractVariables<
    Abi,
    AbiStateMutability,
    readonly unknown[],
    PublicWagmiConfig,
    PublicWagmiConfig['chains'][number]['id']
  >
> = {
  ClipperDirectExchangeV0: clipperV0Withdraw,
  ClipperDirectExchangeV1: clipperWithdraw,
  ClipperVerifiedExchange: clipperWithdraw,
  ClipperCaravelExchange: clipperWithdraw,
  ClipperVerifiedCaravelExchange: clipperWithdraw,
  ClipperApproximateCaravelExchange: clipperWithdraw,
  ClipperPackedVerifiedExchange: clipperWithdraw,
  ClipperPackedExchange: clipperWithdraw,
  ClipperPackedOracleVerifiedExchange: clipperWithdraw,
  BladeVerifiedExchange: bladeWithdraw,
  BladeApproximateCaravelExchange: bladeWithdraw,
}

export const useBladeWithdrawTransaction = ({
  pool,
  onSuccess,
  onError,
}: {
  pool: BladePool
  onSuccess?: (hash: Hex) => void
  onError?: (error: Error) => void
}) => {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const withdrawTransaction = useMutation({
    mutationFn: async (
      args: Omit<WithdrawVariablesGetterArgs, 'poolAddress'>,
    ) => {
      const variables = withdrawWriteVariablesMap[pool.abi]({
        ...args,
        poolAddress: pool.address,
      })
      const txHash = await writeContractAsync(variables)
      return txHash
    },
  })

  return useMemo(
    () => ({
      ...withdrawTransaction,
      writeContract,
      hash,
      isWritePending,
      isConfirming,
      isConfirmed,
      isPending: isWritePending || isConfirming,
      error: writeError || confirmError || withdrawTransaction.error,
      reset: () => {
        reset()
        withdrawTransaction.reset()
      },
    }),
    [
      withdrawTransaction,
      writeContract,
      hash,
      isWritePending,
      isConfirming,
      isConfirmed,
      writeError,
      confirmError,
      reset,
    ],
  )
}
