import { useQuery } from '@tanstack/react-query'
import { Amount, ZERO } from 'sushi'
import {
  type BladeChainId,
  EvmChainId,
  type EvmCurrency,
  isBladeChainId,
  isEvmChainId,
} from 'sushi/evm'
import type { Address, Hex } from 'viem'
import { isAddress } from 'viem'
import { z } from 'zod'
import type { IDExtended } from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-blade'

const toQueryString = (obj: BladeDepositParams): string => {
  const params = new URLSearchParams()

  // we keep your snake_case keys as-is to match your backend
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // handle nested objects (e.g. `deposit` record) by JSON-encoding
    if (typeof value === 'object' && !Array.isArray(value)) {
      params.set(key, JSON.stringify(value))
    } else {
      params.set(key, String(value))
    }
  })

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

const formatDeposit = (
  tokens: EvmCurrency[],
  inputs: Record<IDExtended, string>,
) => {
  //if the input string is empty or "0" skip that input and token
  return tokens.reduce(
    (acc, token) => {
      const input = inputs[token.id]
      const parsedInput = Amount.tryFromHuman(token, input)
      if (parsedInput?.gt(ZERO)) {
        acc[token.wrap().address] = parsedInput.amount.toString()
      }
      return acc
    },
    {} as Record<Address, string>,
  )
}

type BladeDepositParams = z.infer<typeof bladeDepositSchema>

export const useBladeDepositParams = ({
  sender,
  poolAddress,
  chainId,
  tokens,
  inputs,
}: {
  sender?: Address
  poolAddress?: Address
  chainId: BladeChainId
  tokens: EvmCurrency[]
  inputs: Record<IDExtended, string>
}) => {
  return useQuery({
    queryKey: [
      'useBladeDepositParams',
      { sender, poolAddress, chainId, tokens, inputs },
    ],
    queryFn: async () => {
      if (
        !sender ||
        !poolAddress ||
        !chainId ||
        !tokens.length ||
        !Object.keys(inputs).length ||
        tokens.length !== Object.keys(inputs).length
      ) {
        return null
      }
      const deposit = formatDeposit(tokens, inputs)

      const validated = bladeDepositSchema.parse({
        sender,
        pool_address: poolAddress,
        days_to_lock: chainId !== EvmChainId.KATANA ? 1 : undefined, //hardcode 1 for now until UI figured out
        lock_time: chainId === EvmChainId.KATANA ? 1 : undefined, //hardcode 1 for now until UI figured out
        // commented out atm b/c return message says: single asset deposit is not available
        // deposits: isSingleAsset ? undefined: deposits,
        deposit: deposit,
        chain_id: chainId,
        // commented out atm b/c return message says: single asset deposit is not available
        // output_pool_tokens:  undefined,
        // commented out atm b/c return message says: single asset deposit is not available
        // single_asset: isSingleAsset,
        // commented out atm b/c return message says: single asset deposit is not available
        // single_token: isSingleAsset ? Object.keys(deposits)[0] : undefined,
        single_asset: false, //hardcode false for now b/c single asset deposit is not available
        single_token: undefined, //hardcode false for now b/c single asset deposit is not available
      })
      const queryString = toQueryString(validated as BladeDepositParams)
      const res = await fetch(`/api/blade/deposit${queryString}`, {
        method: 'GET',
      })

      if (!res.ok) {
        const bodyText = await res.json().catch(() => '')
        throw new Error(
          bodyText?.errorMessage || 'An unexpected error occurred',
        )
      }

      const data = await res.json()

      if (chainId === 747474) {
        return data as BladeParamResponseKatana
      } else {
        return data as BladeParamResponse
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: Boolean(
      sender &&
        poolAddress &&
        chainId &&
        tokens.length &&
        Object.keys(inputs).length &&
        tokens.length === Object.keys(inputs).length,
    ),
  })
}

type BladeParamBase = {
  sender: Address
  pool_tokens: string
  good_until: number
  signature: {
    v: number
    r: Address
    s: Address
  }
  clipper_exchange_address: Address
  deposit_amounts: string[]
}

export type BladeParamResponse = BladeParamBase & {
  n_days: number
}

export type BladeParamResponseKatana = BladeParamBase & {
  extra_data: Hex
  lock_time: number
}

/** Conditional type by chain id */
export type BladeParamResponseFor<C extends BladeChainId> =
  C extends typeof EvmChainId.KATANA
    ? BladeParamResponseKatana
    : BladeParamResponse

const addressSchema = z
  .string()
  .refine((val) => isAddress(val), { message: 'Invalid address' })

const DepositRecord = z
  .record(
    addressSchema,
    z.string().regex(/^\d+$/, { message: 'Amount must be a numeric string' }),
  )
  .refine((r) => Object.keys(r).length > 0, {
    message: 'deposit cannot be empty',
  })

const booleanStrict = z.union([
  z.boolean(),
  z.literal('true').transform(() => true),
  z.literal('false').transform(() => false),
])

export const bladeDepositSchema = z
  .object({
    sender: addressSchema.describe(
      'The address of the user initiating the deposit transaction.',
    ),
    pool_address: addressSchema.describe('The address of the pool.'),
    days_to_lock: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'Number of days to lock the deposit in the liquidity pool. Required unless pool is Katana.',
      ),
    lock_time: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'Number of minutes to lock the deposit in the liquidity pool. Only supported by Katana.',
      ),
    deposit: z
      .preprocess((v) => {
        if (typeof v === 'string') {
          try {
            return JSON.parse(v)
          } catch {
            // let Zod report the type mismatch below
            return v
          }
        }
        return v
      }, DepositRecord.optional())
      .describe(
        'An object mapping token addresses to deposit amounts (machine-readable string). Required if single_asset is false.',
      ),
    chain_id: z.coerce
      .number()
      .refine((chainId) => isEvmChainId(chainId), {
        message: `chain_id must be a valid EvmChainId`,
      })
      .refine((chainId) => isBladeChainId(chainId), {
        message: `chain_id must be valid BladeChainId`,
      })
      .describe(
        'The unique identifier of the blockchain network where the deposit will be made.',
      ),
    output_pool_tokens: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'The total number of pool tokens the user wants to receive. Only valid for single-asset deposits.',
      ),
    single_asset: booleanStrict
      .default(false)
      .describe('Whether only one asset is being deposited.'),
    single_token: addressSchema
      .optional()
      .describe(
        'Required only when single_asset is true. The address of the single asset being deposited.',
      ),
  })
  .superRefine((data, ctx) => {
    const isKatana = data.chain_id === EvmChainId.KATANA

    // days_to_lock / lock_time rules
    if (isKatana) {
      if (data.lock_time === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lock_time'],
          message: 'lock_time is required for Katana pools',
        })
      }
    } else {
      if (data.days_to_lock === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days_to_lock'],
          message: 'days_to_lock is required for non-Katana pools',
        })
      }
    }

    // deposit / single_token rules

    if (data.single_asset) {
      if (!data.single_token) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['single_token'],
          message: 'single_token is required when single_asset is true',
        })
      }
    } else {
      if (!data.deposit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['deposit'],
          message: 'deposit is required when single_asset is false',
        })
      }
    }
  })
