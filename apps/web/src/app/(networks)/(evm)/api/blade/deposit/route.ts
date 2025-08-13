import type { NextRequest } from 'next/server'
import { EvmChainId } from 'sushi'
import { isEvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'
import { isAddress } from 'viem'
import { z } from 'zod'

const addressSchema = z
  .string()
  .refine((val) => isAddress(val), { message: 'Invalid address' })

export const schema = z
  .object({
    sender: addressSchema.describe(
      'The address of the user initiating the deposit transaction.',
    ),
    pool_address: addressSchema.describe('The address of the pool.'),
    days_to_lock: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'Number of days to lock the deposit in the liquidity pool. Required unless pool is Katana.',
      ),
    lock_time: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        'Number of minutes to lock the deposit in the liquidity pool. Only supported by Katana.',
      ),
    deposit: z
      .record(
        addressSchema,
        z
          .string()
          .regex(/^\d+$/, { message: 'Amount must be a numeric string' }),
      )
      .optional()
      .describe(
        'An object mapping token addresses to deposit amounts (machine-readable string). Required if single_asset is false.',
      ),
    chain_id: z
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
    single_asset: z
      .boolean()
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
      if (!data.lock_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['lock_time'],
          message: 'lock_time is required for Katana pools',
        })
      }
    } else {
      if (!data.days_to_lock) {
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

export async function GET(request: NextRequest) {
  if (!process.env.BLADE_API_KEY) {
    return Response.json(
      { error: 'BLADE_API_KEY is not set' },
      {
        status: 500,
      },
    )
  }
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())

  const { ...parsedParams } = schema.parse(params)

  const url = new URL('https://blade-api.sushi.com/rfq/v2/deposit')

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.BLADE_API_KEY,
    },
    body: JSON.stringify({
      ...parsedParams,
    }),
  }

  try {
    const response = await fetch(url, options)

    return Response.json(await response.json(), {
      status: response.status,
    })
  } catch (error) {
    const _error = error as BladeErrorResponse
    return Response.json(
      {
        errorMessage: _error?.errorMessage || 'An unexpected error occurred',
        errorType: _error?.errorType || 'UnknownError',
        errorCode: _error?.errorCode || 500,
        data: _error?.data || [],
      },
      {
        status: _error?.errorCode || 500,
      },
    )
  }
}

type BladeErrorResponse = {
  errorMessage: string
  errorType: string
  errorCode?: 422 | 409 | 400 | 401 | 403 | 500 | 503 // it is returned only when we have a clipper code for the error
  data?: unknown[] // is is returned only when the input data is invalid
}
