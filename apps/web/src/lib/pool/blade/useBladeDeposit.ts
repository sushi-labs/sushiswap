'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BLADE_API_HOST, BLADE_API_KEY } from 'src/lib/constants'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import { useWatchByBlock } from 'src/lib/wagmi/hooks/watch/useWatchByBlock'
import type { IsEqualMultiple } from 'src/types/utils'
import type { BladeChainId, EvmCurrency } from 'sushi/evm'
import type {
  Abi,
  AbiStateMutability,
  ContractFunctionArgs,
  ContractFunctionName,
} from 'viem'
import { isAddress, isHash, parseUnits, zeroAddress } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useAccount } from 'wagmi'
import type { WriteContractVariables } from 'wagmi/query'
import { z } from 'zod'
import { bladeApproximateExchangeAbi } from './abi/bladeApproximateExchange'
import { bladeVerifiedExchangeAbi } from './abi/bladeVerifiedExchange'
import type { clipperCaravelExchangeAbi } from './abi/clipperCaravelExchange'
import { clipperCommonPackedAbi } from './abi/clipperCommonPacked'
import type { clipperDirectExchangeV0Abi } from './abi/clipperDirectExchangeV0'
import { clipperDirectExchangeV1Abi } from './abi/clipperDirectExchangeV1'
import { byte32, packAddressAndAmount, packRfqConfig } from './utils'

function getAllowDepositQueryKey({
  chainId,
  poolAddress,
  address,
}: {
  chainId: BladeChainId
  poolAddress: string
  address?: string
}) {
  return [
    'blade',
    'pool',
    `${chainId}:${poolAddress}`,
    'allow-deposit',
    address,
  ] as const
}

const rfqAllowDepositResponseBaseSchema = z.object({
  allow: z.boolean(),
  usd_limit: z.number(),
  feature_single_asset_deposit: z.boolean(),
})

const rfqAllowDepositResponseSchema = z.union([
  rfqAllowDepositResponseBaseSchema.extend({
    min_lock_time: z.number(),
  }),
  rfqAllowDepositResponseBaseSchema.extend({
    min_days_to_lock: z.number(),
  }),
])

const rfqDepositResponseBaseSchema = z.object({
  sender: z.string().refine((address) => isAddress(address), {
    message: 'sender does not conform to Address',
  }),
  pool_tokens: z.string(),
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
  clipper_exchange_address: z.string().refine((address) => isAddress(address), {
    message: 'clipper_exchange_address does not conform to Address',
  }),
  extra_data: z
    .string()
    .refine((hash) => isHash(hash), {
      message: 'extra_data does not conform to Hash',
    })
    .optional(),
  deposit_amounts: z.array(z.string()),
  amount: z.string().optional(),
  token: z
    .string()
    .refine((address) => isAddress(address), {
      message: 'token does not conform to Address',
    })
    .optional(),
})

const rfqDepositResponseSchema = z.union([
  rfqDepositResponseBaseSchema.extend({
    lock_time: z.number(),
  }),
  rfqDepositResponseBaseSchema.extend({
    n_days: z.number(),
  }),
])

interface RfqAllowDepositPayload {
  sender: string
  chain_id: number
  pool_address: string
}

export type RfqAllowDepositResponse = z.infer<
  typeof rfqAllowDepositResponseSchema
>
interface RfqDepositPayload {
  sender: string
  deposit: { [address: string]: string }
  chain_id: number
  single_asset?: boolean
  pool_address: string
  lock_time?: number
  days_to_lock?: number
}

type RfqDepositResponse = z.infer<typeof rfqDepositResponseSchema>

type AssertEqualContractFunctionArgs<
  T extends readonly Abi[],
  M extends AbiStateMutability,
  F extends ContractFunctionName<T[number], M>,
> = IsEqualMultiple<{
  readonly [K in keyof T]: ContractFunctionArgs<T[K], M, F>
}>

type DepositVariablesGetterArgs = {
  deposit: RfqDepositResponse
  amounts: {
    token: EvmCurrency
    amount: string
  }[]
}

function clipperPackedTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  const abi = clipperCommonPackedAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)
  const lockTimeParam =
    'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0)
  const { v, r, s } = deposit.signature

  if (deposit.amount && deposit.token) {
    const mutability = 'payable' as const
    const functionName =
      'packedTransmitAndDepositOneAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    const packedInput = packAddressAndAmount(deposit.amount, tokenAddress)
    const packedConfig = packRfqConfig(
      deposit.pool_tokens,
      deposit.good_until,
      lockTimeParam,
      v,
    )

    const variables = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [packedInput, packedConfig, byte32(r), byte32(s)],
      ...(nativeAmount
        ? {
            value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
          }
        : {}),
    }
    return variables
  }

  // For multi-asset deposits, use regular non-packed function since packed version
  // doesn't support multi-asset deposits in this context
  return clipperTransmitAndDeposit({ deposit, amounts })
}

function clipperTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  const abi = clipperDirectExchangeV1Abi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)

  if (deposit.amount && deposit.token) {
    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    if (nativeAmount) {
      const mutability = 'payable' as const
      const functionName =
        'depositSingleAsset' as const satisfies ContractFunctionName<
          typeof abi,
          typeof mutability
        >
      const variables: WriteContractVariables<
        typeof abi,
        typeof functionName,
        AssertEqualContractFunctionArgs<
          [
            typeof clipperCommonPackedAbi,
            typeof clipperDirectExchangeV1Abi,
            typeof clipperCaravelExchangeAbi,
          ],
          typeof mutability,
          typeof functionName
        >,
        PublicWagmiConfig,
        PublicWagmiConfig['chains'][number]['id']
      > = {
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          deposit.sender,
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
        ],
        value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
      }
      return variables
    } else {
      const mutability = 'nonpayable' as const
      const functionName =
        'transmitAndDepositSingleAsset' as const satisfies ContractFunctionName<
          typeof abi,
          typeof mutability
        >
      const variables: WriteContractVariables<
        typeof abi,
        typeof functionName,
        AssertEqualContractFunctionArgs<
          [
            typeof clipperCommonPackedAbi,
            typeof clipperDirectExchangeV1Abi,
            typeof clipperCaravelExchangeAbi,
          ],
          typeof mutability,
          typeof functionName
        >,
        PublicWagmiConfig,
        PublicWagmiConfig['chains'][number]['id']
      > = {
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
        ],
      }
      return variables
    }
  }

  if (nativeAmount) {
    const mutability = 'payable' as const
    const functionName = 'deposit' as const satisfies ContractFunctionName<
      typeof abi,
      typeof mutability
    >

    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [
          typeof clipperCommonPackedAbi,
          typeof clipperDirectExchangeV1Abi,
          typeof clipperCaravelExchangeAbi,
        ],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.sender,
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
      ] as const,
      // TODO: Use deposit amount from API
      value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
    }
    return variables
  } else {
    const mutability = 'nonpayable' as const
    const functionName =
      'transmitAndDeposit' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >
    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [
          typeof clipperCommonPackedAbi,
          typeof clipperDirectExchangeV0Abi,
          typeof clipperDirectExchangeV1Abi,
          typeof clipperCaravelExchangeAbi,
        ],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
      ],
    }
    return variables
  }
}

function clipperV0TransmitAndDeposit(args: DepositVariablesGetterArgs) {
  const { deposit, amounts } = args
  const hasNativeAmount = amounts.some((amount) => amount.token.isNative)

  if (deposit.amount && deposit.token) {
    throw new Error('Single asset deposits are not supported for Clipper V0')
  }

  if (hasNativeAmount) {
    throw new Error('Native amount deposits are not supported for Clipper V0')
  }

  return clipperTransmitAndDeposit(args)
}

function bladeTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  if (!deposit.extra_data) {
    throw new Error('Extra data is required for blade deposits')
  }

  const abi = bladeApproximateExchangeAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)

  if (deposit.amount && deposit.token) {
    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    if (nativeAmount) {
      const mutability = 'payable' as const
      const functionName =
        'depositSingleAsset' as const satisfies ContractFunctionName<
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
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          deposit.sender,
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
          deposit.extra_data,
        ],
        value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
      }
      return variables
    } else {
      const mutability = 'nonpayable' as const
      const functionName =
        'transmitAndDepositSingleAsset' as const satisfies ContractFunctionName<
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
        address: deposit.clipper_exchange_address,
        abi,
        functionName,
        args: [
          tokenAddress,
          BigInt(deposit.amount),
          BigInt(
            'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
          ),
          BigInt(deposit.pool_tokens),
          BigInt(deposit.good_until),
          deposit.signature,
          deposit.extra_data,
        ],
      }
      return variables
    }
  }

  if (nativeAmount) {
    const mutability = 'payable' as const
    const functionName = 'deposit' as const satisfies ContractFunctionName<
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
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.sender,
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
        deposit.extra_data,
      ] as const,
      value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
    }
    return variables
  } else {
    const mutability = 'nonpayable' as const
    const functionName =
      'transmitAndDeposit' as const satisfies ContractFunctionName<
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
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        deposit.deposit_amounts.map((amount) => BigInt(amount)),
        BigInt(
          'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0),
        ),
        BigInt(deposit.pool_tokens),
        BigInt(deposit.good_until),
        deposit.signature,
        deposit.extra_data,
      ],
    }
    return variables
  }
}

function bladePackedTransmitAndDeposit({
  deposit,
  amounts,
}: DepositVariablesGetterArgs) {
  if (!deposit.extra_data) {
    throw new Error('Extra data is required for blade deposits')
  }

  const abi = bladeVerifiedExchangeAbi
  const nativeAmount = amounts.find((amount) => amount.token.isNative)
  const lockTimeParam =
    'lock_time' in deposit ? deposit.lock_time : (deposit.n_days ?? 0)
  const { v, r, s } = deposit.signature

  // Handle single asset deposits using packed format
  if (deposit.amount && deposit.token) {
    const tokenAddress = nativeAmount ? zeroAddress : deposit.token
    const mutability = 'payable' as const
    const functionName =
      'packedTransmitAndDepositSingleAsset' as const satisfies ContractFunctionName<
        typeof abi,
        typeof mutability
      >

    const packedInput = packAddressAndAmount(deposit.amount, tokenAddress)
    const packedConfig = packRfqConfig(
      deposit.pool_tokens,
      deposit.good_until,
      lockTimeParam,
      v,
    )

    const variables: WriteContractVariables<
      typeof abi,
      typeof functionName,
      AssertEqualContractFunctionArgs<
        [typeof bladeVerifiedExchangeAbi],
        typeof mutability,
        typeof functionName
      >,
      PublicWagmiConfig,
      PublicWagmiConfig['chains'][number]['id']
    > = {
      address: deposit.clipper_exchange_address,
      abi,
      functionName,
      args: [
        packedInput,
        packedConfig,
        byte32(r),
        byte32(s),
        deposit.extra_data,
      ],
      ...(nativeAmount
        ? {
            value: parseUnits(nativeAmount.amount, nativeAmount.token.decimals),
          }
        : {}),
    }
    return variables
  }

  // For multi-asset deposits, use regular blade function
  return bladeTransmitAndDeposit({ deposit, amounts })
}

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

export const useBladeAllowDeposit = ({
  chainId,
  poolAddress,
  enabled = true,
}: {
  chainId: BladeChainId
  poolAddress: string
  enabled?: boolean
}) => {
  const { address } = useAccount()

  const queryKey = getAllowDepositQueryKey({ chainId, poolAddress, address })

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<RfqAllowDepositResponse> => {
      if (!address) throw new Error('No address provided')

      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/allow-deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify({
          chain_id: chainId,
          sender: address,
          pool_address: poolAddress,
        } satisfies RfqAllowDepositPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to check deposit permission')
      }

      const responseData = await response.json()

      return rfqAllowDepositResponseSchema.parse(responseData)
    },
    enabled: Boolean(enabled && address && chainId && poolAddress),
  })

  useWatchByBlock({
    chainId,
    key: queryKey,
    modulo: 10,
  })

  return query
}

export const useBladeDepositRequest = ({
  onError,
}: {
  onError?: (e: Error) => void
} = {}) => {
  const mutation = useMutation({
    mutationFn: async (
      payload: RfqDepositPayload,
    ): Promise<RfqDepositResponse> => {
      const response = await fetch(`${BLADE_API_HOST}/rfq/v2/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(BLADE_API_KEY ? { 'x-api-key': BLADE_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create deposit signature')
      }

      const responseData = await response.json()
      return rfqDepositResponseSchema.parse(responseData)
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

export const useBladeDepositTransaction = ({
  pool,
  onSuccess,
  onError,
}: {
  pool: BladePool
  onSuccess?: (hash: `0x${string}`) => void
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
      console.log({
        abi: pool.abi,
      })
      const txHash = await writeContractAsync(
        depositWriteVariablesMap[pool.abi](args),
      )
      return txHash
    },
  })

  return {
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
  }
}
