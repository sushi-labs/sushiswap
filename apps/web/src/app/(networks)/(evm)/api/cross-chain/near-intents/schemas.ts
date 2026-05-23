import {
  GetExecutionStatusResponse,
  QuoteRequest,
  type SubmitDepositTxResponse,
  type TokenResponse,
} from '@defuse-protocol/one-click-sdk-typescript'
import { checkTrustlineRequired } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/trustline-helpers'
import {
  type NearIntentsDepositAddress,
  type NearIntentsSdkToken,
  type NearIntentsSupportedChainId,
  buildNearIntentsAppFees,
  filterSupportedTokens,
  formatDeadline,
  getDepositMode,
  getPreviewAddressPlaceholder,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents'
import { isEvmAddress } from 'sushi/evm'
import {
  isStellarAccountAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import * as z from 'zod'

const nearIntentsSupportedChainIdSchema = z
  .number()
  .int()
  .refine((chainId) => isNearIntentsChainId(chainId), {
    message: 'chainId must exist in NearIntentsSupportedChainId',
  })
  .transform((chainId) => chainId as NearIntentsSupportedChainId)

const sdkTokenSchema: z.ZodType<NearIntentsSdkToken> = z.object({
  assetId: z.string().min(1),
  decimals: z.number().int().nonnegative(),
  blockchain: z.string().min(1),
  symbol: z.string().min(1),
  price: z.number(),
  priceUpdatedAt: z.string().min(1),
  contractAddress: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),
  assetIssuer: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),
  logoURI: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),
  name: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value ?? undefined),
})

export const nearIntentsTokenSchema = z.object({
  assetId: z.string().min(1),
  chainId: nearIntentsSupportedChainIdSchema,
  blockchain: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1).optional(),
  decimals: z.number().int().nonnegative(),
  priceUSD: z.string().min(1),
  priceUpdatedAt: z.string().min(1),
  contractAddress: z.string().optional(),
  assetIssuer: z.string().optional(),
  logoURI: z.string().min(1).optional(),
  kind: z.enum(['native', 'erc20', 'stellar-native', 'stellar-issued']),
})

export const nearIntentsTokensResponseSchema = z.object({
  tokens: z.array(nearIntentsTokenSchema),
})

export const nearIntentsQuoteRequestSchema = z
  .object({
    dry: z.boolean(),
    fromChainId: nearIntentsSupportedChainIdSchema,
    toChainId: nearIntentsSupportedChainIdSchema,
    originAsset: z.string().min(1),
    destinationAsset: z.string().min(1),
    amount: z.string().regex(/^\d+$/, 'amount must be a raw integer string'),
    slippageBps: z.coerce.number().int().min(0).max(10_000),
    recipient: z.string().min(1).optional(),
    refundTo: z.string().min(1).optional(),
  })
  .refine(({ fromChainId, toChainId }) => fromChainId !== toChainId, {
    message: 'fromChainId and toChainId must differ',
    path: ['toChainId'],
  })
  .refine(
    ({ dry, recipient, refundTo }) =>
      dry || (typeof recipient === 'string' && typeof refundTo === 'string'),
    {
      message: 'recipient and refundTo are required for executable quotes',
      path: ['recipient'],
    },
  )

export type NearIntentsQuoteRequest = z.infer<
  typeof nearIntentsQuoteRequestSchema
>

const nearIntentsDepositAddressSchema = z
  .string()
  .min(1)
  .refine(
    (address) => isEvmAddress(address) || isStellarAccountAddress(address),
    {
      message: 'depositAddress must be a valid EVM or Stellar account address',
    },
  )
  .transform((address) => address as NearIntentsDepositAddress)

const nearIntentsQuoteSchema = z.object({
  depositAddress: nearIntentsDepositAddressSchema.optional(),
  depositMemo: z.string().min(1).optional(),
  amountIn: z.string().min(1),
  amountInFormatted: z.string().min(1),
  amountInUsd: z.string().min(1),
  minAmountIn: z.string().min(1),
  amountOut: z.string().min(1),
  amountOutFormatted: z.string().min(1),
  amountOutUsd: z.string().min(1),
  minAmountOut: z.string().min(1),
  deadline: z.string().min(1).optional(),
  timeWhenInactive: z.string().min(1).optional(),
  timeEstimate: z.number().nonnegative(),
  refundFee: z.string().min(1).optional(),
})

export const nearIntentsQuoteResponseSchema = z.object({
  correlationId: z.string().min(1),
  timestamp: z.string().min(1),
  signature: z.string().min(1),
  quote: nearIntentsQuoteSchema,
})

export type NearIntentsQuoteResponse = z.infer<
  typeof nearIntentsQuoteResponseSchema
>

const sdkQuoteResponseSchema = z.object({
  correlationId: z.string().min(1),
  timestamp: z.string().min(1),
  signature: z.string().min(1),
  quote: z.object({
    depositAddress: z.string().min(1).optional(),
    depositMemo: z.string().min(1).optional(),
    amountIn: z.string().min(1),
    amountInFormatted: z.string().min(1),
    amountInUsd: z.string().min(1),
    minAmountIn: z.string().min(1),
    amountOut: z.string().min(1),
    amountOutFormatted: z.string().min(1),
    amountOutUsd: z.string().min(1),
    minAmountOut: z.string().min(1),
    deadline: z.string().min(1).optional(),
    timeWhenInactive: z.string().min(1).optional(),
    timeEstimate: z.number().nonnegative(),
    refundFee: z.string().min(1).optional(),
  }),
})

export const nearIntentsDepositSubmitRequestSchema = z.object({
  depositAddress: z.string().min(1),
  txHash: z.string().min(1),
  memo: z.string().min(1).optional(),
  nearSenderAccount: z.string().min(1).optional(),
})

export const nearIntentsStatusRequestSchema = z.object({
  depositAddress: z.string().min(1),
  depositMemo: z.string().min(1).optional(),
})

export const nearIntentsStatusResponseSchema = z.object({
  status: z.enum(GetExecutionStatusResponse.status),
  destinationTxHashes: z
    .array(
      z.object({
        hash: z.string().min(1),
      }),
    )
    .default([]),
})

export type NearIntentsStatusResponse = z.infer<
  typeof nearIntentsStatusResponseSchema
>

export function parseNearIntentsSdkTokens(
  tokens: unknown,
): NearIntentsSdkToken[] {
  return z.array(sdkTokenSchema).parse(tokens)
}

async function resolveStellarTokenIssuer(
  token: NearIntentsSdkToken,
): Promise<NearIntentsSdkToken> {
  if (
    token.blockchain !== 'stellar' ||
    token.assetIssuer ||
    !token.contractAddress ||
    !isStellarContractAddress(token.contractAddress)
  ) {
    return token
  }

  const trustline = await checkTrustlineRequired(
    token.contractAddress,
    token.symbol,
  )

  return trustline.issuer ? { ...token, assetIssuer: trustline.issuer } : token
}

export async function normalizeNearIntentsTokens(tokens: unknown) {
  const parsedTokens = parseNearIntentsSdkTokens(tokens)
  const resolvedTokens = await Promise.all(
    parsedTokens.map(resolveStellarTokenIssuer),
  )

  return nearIntentsTokensResponseSchema.parse({
    tokens: filterSupportedTokens(resolvedTokens),
  })
}

export function buildNearIntentsSdkQuoteRequest(
  request: NearIntentsQuoteRequest,
): QuoteRequest {
  const recipient =
    request.recipient ?? getPreviewAddressPlaceholder(request.toChainId)
  const refundTo =
    request.refundTo ?? getPreviewAddressPlaceholder(request.fromChainId)

  return {
    dry: request.dry,
    depositMode: getDepositMode(request.fromChainId),
    swapType: QuoteRequest.swapType.EXACT_INPUT,
    slippageTolerance: request.slippageBps,
    originAsset: request.originAsset,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset: request.destinationAsset,
    amount: request.amount,
    refundTo,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline: formatDeadline(),
    quoteWaitingTimeMs: 3000,
    appFees: buildNearIntentsAppFees({
      fromChainId: request.fromChainId,
      toChainId: request.toChainId,
    }),
  } satisfies QuoteRequest
}

export function normalizeNearIntentsQuoteResponse(response: unknown) {
  const parsedResponseResult = sdkQuoteResponseSchema.safeParse(response)

  if (!parsedResponseResult.success) {
    throw new z.ZodError([
      {
        code: 'custom',
        message: 'Invalid NEAR Intents quote response',
        path: [],
      },
    ])
  }

  const parsedResponse = parsedResponseResult.data

  return nearIntentsQuoteResponseSchema.parse({
    correlationId: parsedResponse.correlationId,
    timestamp: parsedResponse.timestamp,
    signature: parsedResponse.signature,
    quote: {
      depositAddress: parsedResponse.quote.depositAddress,
      depositMemo: parsedResponse.quote.depositMemo,
      amountIn: parsedResponse.quote.amountIn,
      amountInFormatted: parsedResponse.quote.amountInFormatted,
      amountInUsd: parsedResponse.quote.amountInUsd,
      minAmountIn: parsedResponse.quote.minAmountIn,
      amountOut: parsedResponse.quote.amountOut,
      amountOutFormatted: parsedResponse.quote.amountOutFormatted,
      amountOutUsd: parsedResponse.quote.amountOutUsd,
      minAmountOut: parsedResponse.quote.minAmountOut,
      deadline: parsedResponse.quote.deadline,
      timeWhenInactive: parsedResponse.quote.timeWhenInactive,
      timeEstimate: parsedResponse.quote.timeEstimate,
      refundFee: parsedResponse.quote.refundFee,
    },
  })
}

type NearIntentsExecutionResponse =
  | GetExecutionStatusResponse
  | SubmitDepositTxResponse

export function normalizeNearIntentsExecutionResponse(
  response: NearIntentsExecutionResponse,
) {
  return nearIntentsStatusResponseSchema.parse({
    status: response.status,
    destinationTxHashes: response.swapDetails.destinationChainTxHashes,
  })
}
