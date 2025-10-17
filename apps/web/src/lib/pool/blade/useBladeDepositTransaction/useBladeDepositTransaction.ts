'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { Abi, AbiStateMutability, Hex } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import type { WriteContractVariables } from 'wagmi/query'
import type { DepositVariablesGetterArgs } from './types'
import { bladePackedTransmitAndDeposit } from './variables/bladePackedTransmitAndDeposit'
import { bladeTransmitAndDeposit } from './variables/bladeTransmitAndDeposit'
import { clipperPackedTransmitAndDeposit } from './variables/clipperPackedTransmitAndDeposit'
import { clipperTransmitAndDeposit } from './variables/clipperTransmitAndDeposit'
import { clipperV0TransmitAndDeposit } from './variables/clipperV0TransmitAndDeposit'

const depositWriteVariablesMap: Record<
  BladePool['abi'],
  (
    args: DepositVariablesGetterArgs,
  ) => WriteContractVariables<
    Abi,
    AbiStateMutability,
    readonly unknown[],
    PublicWagmiConfig,
    PublicWagmiConfig['chains'][number]['id']
  >
> = {
  ClipperDirectExchangeV0: clipperV0TransmitAndDeposit,
  ClipperDirectExchangeV1: clipperTransmitAndDeposit,
  ClipperVerifiedExchange: clipperTransmitAndDeposit,
  ClipperCaravelExchange: clipperTransmitAndDeposit,
  ClipperVerifiedCaravelExchange: clipperTransmitAndDeposit,
  ClipperApproximateCaravelExchange: clipperTransmitAndDeposit,
  ClipperPackedVerifiedExchange: clipperPackedTransmitAndDeposit,
  ClipperPackedExchange: clipperPackedTransmitAndDeposit,
  ClipperPackedOracleVerifiedExchange: clipperPackedTransmitAndDeposit,
  BladeVerifiedExchange: bladePackedTransmitAndDeposit,
  BladeApproximateCaravelExchange: bladeTransmitAndDeposit,
}

export const useBladeDepositTransaction = ({
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

  const depositTransaction = useMutation({
    mutationFn: async (args: DepositVariablesGetterArgs) => {
      const txHash = await writeContractAsync(
        depositWriteVariablesMap[pool.abi](args),
      )
      return txHash
    },
  })

  return useMemo(
    () => ({
      ...depositTransaction,
      writeContract,
      hash,
      isWritePending,
      isConfirming,
      isConfirmed,
      isPending: isWritePending || isConfirming,
      error: writeError || confirmError || depositTransaction.error,
      reset: () => {
        reset()
        depositTransaction.reset()
      },
    }),
    [
      depositTransaction,
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
