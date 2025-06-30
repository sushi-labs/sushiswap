'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
import type { IsEqualMultiple } from 'src/types/utils'
import type { BladeChainId } from 'sushi/config'
import type { Type } from 'sushi/currency'
import type {
  Abi,
  AbiStateMutability,
  ContractFunctionArgs,
  ContractFunctionName,
} from 'viem'
import { parseUnits, zeroAddress } from 'viem'
import {
  useBlockNumber,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { useAccount } from 'wagmi'
import type { WriteContractVariables } from 'wagmi/query'
import { bladeApproximateExchangeAbi } from './abi/bladeApproximateExchange'
import { bladeVerifiedExchangeAbi } from './abi/bladeVerifiedExchange'
import type { clipperCaravelExchangeAbi } from './abi/clipperCaravelExchange'
import { clipperCommonPackedAbi } from './abi/clipperCommonPacked'
import type { clipperDirectExchangeV0Abi } from './abi/clipperDirectExchangeV0'
import { clipperDirectExchangeV1Abi } from './abi/clipperDirectExchangeV1'
import { byte32, packAddressAndAmount, packRfqConfig } from './utils'

const BLADE_API_HOST =
  process.env['BLADE_API_HOST'] ||
  process.env['NEXT_PUBLIC_BLADE_API_HOST'] ||
  'https://api.clipper.exchange'

const BLADE_API_KEY =
  process.env['BLADE_API_KEY'] || process.env['NEXT_PUBLIC_BLADE_API_KEY']

interface RfqAllowDepositPayload {
  sender: string
  chain_id: number
  pool_address: string
}

export type RfqAllowDepositResponse = {
  allow: boolean
  usd_limit: number
  feature_single_asset_deposit: boolean
} & (
  | {
      min_lock_time: number
    }
  | {
      min_days_to_lock: number
    }
)

interface RfqDepositPayload {
  sender: string
  deposit: { [address: string]: string }
  chain_id: number
  single_asset?: boolean
  pool_address: string
  lock_time?: number
  days_to_lock?: number
}

type RfqDepositResponse = {
  sender: `0x${string}`
  pool_tokens: string
  good_until: number
  signature: {
    v: number
    r: `0x${string}`
    s: `0x${string}`
  }
  clipper_exchange_address: `0x${string}`
  extra_data?: `0x${string}`
  deposit_amounts: string[]
  amount?: string
  token?: `0x${string}`
} & (
  | {
      lock_time: number
    }
  | {
      n_days: number
    }
)

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
    token: Type
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
    } as any
    return variables
  }

  // For multi-asset dexposits, use regular non-packed function since packed version
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
    console.log({ variables })
    // @ts-expect-error TODO: Review why it's producing a complex union type
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
  BladeApproximateExchange: bladeTransmitAndDeposit,
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
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [
      'blade',
      'pool',
      `${chainId}:${poolAddress}`,
      'allow-deposit',
      address,
    ],
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

      return response.json()
    },
    enabled: Boolean(enabled && address && chainId && poolAddress),
  })

  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: {
      pollingInterval: 15_000,
      poll: true,
    },
  })

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({
        queryKey: [
          'blade',
          'pool',
          `${chainId}:${poolAddress}`,
          'allow-deposit',
          address,
        ],
      })
    }
  }, [blockNumber, queryClient, chainId, poolAddress, address])

  return query
}

export const useBladeDepositRequest = () => {
  return useMutation({
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

      return response.json()
    },
  })
}

export const useBladeDepositTransaction = ({
  pool,
  onSuccess,
  onError,
}: {
  pool: BladePool
  onSuccess?: (hash: string) => void
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
      onSuccess: (hash) => {
        onSuccess?.(hash)
      },
      onError: (error) => {
        onError?.(error as Error)
      },
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
