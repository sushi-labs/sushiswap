'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { IsEqualMultiple } from 'src/types/utils'
import { type EvmAddress, type EvmCurrency, isEvmAddress } from 'sushi/evm'
import type {
  Abi,
  AbiStateMutability,
  ContractFunctionArgs,
  ContractFunctionName,
  Hex,
} from 'viem'
import { isHash, zeroAddress } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import type { WriteContractVariables } from 'wagmi/query'
import { z } from 'zod'
import { bladeApproximateExchangeAbi } from './abi/bladeApproximateExchange'
import type { bladeVerifiedExchangeAbi } from './abi/bladeVerifiedExchange'
import type { clipperCaravelExchangeAbi } from './abi/clipperCaravelExchange'
import type { clipperCommonPackedAbi } from './abi/clipperCommonPacked'
import type { clipperDirectExchangeV0Abi } from './abi/clipperDirectExchangeV0'
import { clipperDirectExchangeV1Abi } from './abi/clipperDirectExchangeV1'

const rfqWithdrawResponseSchema = z.object({
  token_holder_address: z.string().refine(isEvmAddress, {
    message: 'token_holder_address does not conform to Address',
  }),
  pool_token_amount_to_burn: z.string(),
  asset_address: z.string().refine(isEvmAddress, {
    message: 'asset_address does not conform to Address',
  }),
  asset_amount: z.string(),
  good_until: z.number(),
  signature: z.object({
    v: z.number(),
    r: z.string().refine((hash) => isHash(hash), {
      message: 'r does not conform to Hash',
    }),
    s: z.string().refine((hash) => isHash(hash), {
      message: 's does not conform to Hash',
    }),
  }),
  extra_data: z.string().refine((hash) => isHash(hash), {
    message: 'extra_data does not conform to Hash',
  }),
})

export type RfqWithdrawPayload = {
  chain_id: number
  pool_token_amount_to_burn: string
  asset_symbol: string
  token_holder_address: string
  pool_address: string
}

export type RfqWithdrawResponse = z.infer<typeof rfqWithdrawResponseSchema>

type AssertEqualContractFunctionArgs<
  T extends readonly Abi[],
  M extends AbiStateMutability,
  F extends ContractFunctionName<T[number], M>,
> = IsEqualMultiple<{
  readonly [K in keyof T]: ContractFunctionArgs<T[K], M, F>
}>

type WithdrawVariablesGetterArgs = {
  poolAddress: EvmAddress
  poolTokenAmountToBurn: string
  withdraw?: RfqWithdrawResponse
  token?: EvmCurrency
}

function clipperWithdraw({
  withdraw,
  token,
  poolTokenAmountToBurn,
  poolAddress,
}: WithdrawVariablesGetterArgs) {
  const abi = clipperDirectExchangeV1Abi

  if (withdraw && token) {
    // Single asset withdrawal
    const mutability = 'nonpayable' as const
    const functionName =
      'withdrawSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const args: AssertEqualContractFunctionArgs<
      [
        typeof clipperCaravelExchangeAbi,
        typeof clipperCommonPackedAbi,
        typeof clipperDirectExchangeV1Abi,
      ],
      typeof mutability,
      typeof functionName
    > = [
      withdraw.token_holder_address,
      BigInt(withdraw.pool_token_amount_to_burn),
      token.isNative ? zeroAddress : withdraw.asset_address,
      BigInt(withdraw.asset_amount),
      BigInt(withdraw.good_until),
      withdraw.signature,
    ]
    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      typeof args,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: poolAddress,
      abi,
      functionName,
      args,
    }
    return variables
  }

  // Multi-asset withdrawal
  const mutability = 'nonpayable' as const
  const functionName = 'burnToWithdraw' as const satisfies ContractFunctionName<
    typeof abi,
    typeof mutability
  >

  const variables: WriteContractVariables<
    typeof abi,
    typeof functionName,
    AssertEqualContractFunctionArgs<
      [
        typeof clipperDirectExchangeV1Abi,
        typeof clipperCaravelExchangeAbi,
        typeof clipperCommonPackedAbi,
        typeof clipperDirectExchangeV0Abi,
      ],
      typeof mutability,
      typeof functionName
    >,
    PublicWagmiConfig,
    PublicWagmiConfig['chains'][number]['id']
  > = {
    address: poolAddress,
    abi,
    functionName,
    args: [BigInt(poolTokenAmountToBurn)],
  }
  return variables
}

function clipperV0Withdraw(args: WithdrawVariablesGetterArgs) {
  if (args.withdraw && args.token) {
    throw new Error('Single asset withdrawals are not supported for Clipper V0')
  }

  return clipperWithdraw(args)
}

function bladeWithdraw({
  withdraw,
  token,
  poolTokenAmountToBurn,
  poolAddress,
}: WithdrawVariablesGetterArgs) {
  const abi = bladeApproximateExchangeAbi

  if (withdraw && token) {
    // Single asset withdrawal
    const mutability = 'nonpayable' as const
    const functionName =
      'withdrawSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const args: AssertEqualContractFunctionArgs<
      [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
      typeof mutability,
      typeof functionName
    > = [
      withdraw.token_holder_address,
      BigInt(withdraw.pool_token_amount_to_burn),
      token.isNative ? zeroAddress : withdraw.asset_address,
      BigInt(withdraw.asset_amount),
      BigInt(withdraw.good_until),
      withdraw.signature,
      withdraw.extra_data,
    ]
    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: poolAddress,
      abi,
      functionName,
      args,
    }
    return variables
  }

  // Multi-asset withdrawal
  const mutability = 'nonpayable' as const
  const functionName = 'burnToWithdraw' as const satisfies ContractFunctionName<
    typeof abi,
    typeof mutability
  >

  const variables: WriteContractVariables<
    typeof abi,
    typeof functionName,
    AssertEqualContractFunctionArgs<
      [typeof bladeApproximateExchangeAbi, typeof bladeVerifiedExchangeAbi],
      typeof mutability,
      typeof functionName
    >,
    PublicWagmiConfig,
    PublicWagmiConfig['chains'][number]['id']
  > = {
    address: poolAddress,
    abi,
    functionName,
    args: [BigInt(poolTokenAmountToBurn)],
  }
  return variables
}

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

export const useBladeWithdrawRequest = ({
  onError,
}: {
  onError?: (error: Error) => void
} = {}) => {
  const mutation = useMutation({
    mutationFn: async (
      payload: RfqWithdrawPayload,
    ): Promise<RfqWithdrawResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const responseData = await response.json()

      return rfqWithdrawResponseSchema.parse(responseData)
    },
    onError,
  })

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      const now = Date.now()
      const goodUntil = mutation.data.good_until * 1000
      const remainingTime = goodUntil - now

      if (remainingTime > 0) {
        const timerId = setTimeout(() => {
          mutation.reset()
        }, remainingTime)

        return () => {
          clearTimeout(timerId)
        }
      } else {
        mutation.reset()
      }
    }
  }, [mutation.isSuccess, mutation.data, mutation.reset])

  return mutation
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

  return {
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
  }
}
