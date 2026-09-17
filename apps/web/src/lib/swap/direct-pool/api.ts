import {
  type EvmAddress,
  type LaunchpadV2ChainId,
  isLaunchpadV2ChainId,
  szevm,
} from 'sushi/evm'
import * as z from 'zod'

const uintStringSchema = z.string().regex(/^\d+$/)

export const directPoolQuoteInputSchema = z.object({
  chainId: z.coerce
    .number()
    .pipe(
      z.custom<LaunchpadV2ChainId>(
        (value) => typeof value === 'number' && isLaunchpadV2ChainId(value),
      ),
    ),
  tokenIn: szevm.address(),
  tokenOut: szevm.address(),
  amount: z
    .string()
    .refine((value) => /^\d+$/.test(value) && BigInt(value) > 0n),
  feeTier: z.coerce
    .number()
    .int()
    .min(0)
    .max(2 ** 24 - 1),
})

export const directPoolQuoteResponseSchema = z.object({
  amountOut: uintStringSchema,
  gasEstimate: uintStringSchema,
})

export interface DirectPoolQuoteInput {
  chainId: LaunchpadV2ChainId
  tokenIn: EvmAddress
  tokenOut: EvmAddress
  amount: string
  feeTier: number
}

export type DirectPoolQuoteResponse = z.output<
  typeof directPoolQuoteResponseSchema
>

export function getDirectPoolQuoteUrl(input: DirectPoolQuoteInput): string {
  const params = new URLSearchParams({
    chainId: input.chainId.toString(),
    tokenIn: input.tokenIn,
    tokenOut: input.tokenOut,
    amount: input.amount,
    feeTier: input.feeTier.toString(),
  })

  return `/api/direct-pool/quote?${params.toString()}`
}
