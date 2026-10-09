import { type EvmAddress, isEvmAddress } from 'sushi/evm'
import {
  type StellarAccountAddress,
  isStellarAccountAddress,
} from 'sushi/stellar'
import { type SvmAddress, isSvmAddress } from 'sushi/svm'
import * as z from 'zod'
import { getValueTransferQuoteExpiry } from './quote-expiry'

const chainKeySchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/)
const addressSchema = z.string().min(1).max(200)
const unsignedIntegerSchema = z.string().regex(/^\d+$/).max(100)
const decimalSchema = z
  .string()
  .regex(/^\d+(\.\d+)?$/)
  .max(100)
const quoteIdSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9_-]+$/)
const hexSchema = z.custom<`0x${string}`>(
  (value) => typeof value === 'string' && /^0x(?:[\da-fA-F]{2})*$/.test(value),
  'Invalid hex data',
)
const evmAddressSchema = z.custom<EvmAddress>(
  (value) => typeof value === 'string' && isEvmAddress(value),
  'Invalid EVM address',
)
const svmAddressSchema = z.custom<SvmAddress>(
  (value) => typeof value === 'string' && isSvmAddress(value),
  'Invalid Solana address',
)
const stellarAccountAddressSchema = z.custom<StellarAccountAddress>(
  (value) => typeof value === 'string' && isStellarAccountAddress(value),
  'Invalid Stellar account address',
)
const base64Schema = z
  .string()
  .min(1)
  .max(200_000)
  .regex(/^[A-Za-z0-9+/]+={0,2}$/)

function isSupportedWalletAddress(address: string): boolean {
  return (
    isEvmAddress(address) ||
    isSvmAddress(address) ||
    isStellarAccountAddress(address)
  )
}

export const valueTransferTokenSchema = z.object({
  chainKey: chainKeySchema,
  address: addressSchema,
  decimals: z.number().int().min(0).max(255),
  symbol: z.string(),
  name: z.string(),
  isSupported: z.boolean().optional(),
  price: z
    .object({ usd: z.number().finite().nonnegative().optional() })
    .nullish(),
  icon: z.string().optional(),
  logoURI: z.string().optional(),
  logoUrl: z.string().optional(),
})

export const valueTransferChainSchema = z.object({
  chainKey: chainKeySchema,
  chainType: z.string().min(1),
  chainId: z.union([z.number().int(), z.string().min(1)]),
  name: z.string().min(1),
  shortName: z.string(),
  nativeCurrency: valueTransferTokenSchema,
})

const paginationSchema = z.object({ nextToken: z.string().min(1).optional() })
export const valueTransferChainsResponseSchema = z.object({
  chains: z.array(valueTransferChainSchema),
  pagination: paginationSchema.optional(),
})
export const valueTransferTokensResponseSchema = z.object({
  tokens: z.array(valueTransferTokenSchema),
  pagination: paginationSchema.optional(),
})
export const valueTransferTokensRequestSchema = z
  .object({
    transferrableFromChainKey: chainKeySchema.optional(),
    transferrableFromTokenAddress: addressSchema.optional(),
  })
  .refine(
    (request) =>
      !request.transferrableFromTokenAddress ||
      !!request.transferrableFromChainKey,
    'A source chain is required when filtering by source token',
  )
export const valueTransferMetadataResponseSchema = z.record(
  chainKeySchema,
  z.object({
    deployments: z.object({
      multicall: z
        .object({ address: z.union([evmAddressSchema, svmAddressSchema]) })
        .optional(),
      transferDelegate: z.object({ address: evmAddressSchema }).optional(),
    }),
  }),
)

export const valueTransferQuoteRequestSchema = z
  .object({
    srcChainKey: chainKeySchema,
    dstChainKey: chainKeySchema,
    srcTokenAddress: addressSchema,
    dstTokenAddress: addressSchema,
    srcWalletAddress: addressSchema.refine(
      isSupportedWalletAddress,
      'Unsupported sender address',
    ),
    dstWalletAddress: addressSchema.refine(
      isSupportedWalletAddress,
      'Unsupported recipient address',
    ),
    amount: unsignedIntegerSchema.refine(
      (amount) => /[1-9]/.test(amount),
      'Amount must be positive',
    ),
    // The API documents fee variance; live quotes also use this percentage to
    // calculate dstAmountMin. Callers must independently enforce the user's
    // minimum output instead of relying on that observed behavior alone.
    options: z
      .object({
        feeTolerance: z.object({
          type: z.literal('PERCENT'),
          amount: z.number().finite().min(0).max(100),
        }),
      })
      .optional(),
  })
  .refine((request) => request.srcChainKey !== request.dstChainKey, {
    message: 'Source and destination chains must differ',
    path: ['dstChainKey'],
  })

const userStepFields = {
  description: z.string(),
  chainKey: chainKeySchema,
}
export const valueTransferEvmTransactionStepSchema = z.object({
  ...userStepFields,
  type: z.literal('TRANSACTION'),
  chainType: z.literal('EVM'),
  signerAddress: evmAddressSchema,
  transaction: z.object({
    encoded: z.object({
      chainId: z.number().int().positive(),
      to: evmAddressSchema,
      data: hexSchema,
      from: evmAddressSchema.optional(),
      value: unsignedIntegerSchema.optional(),
      gasLimit: unsignedIntegerSchema.optional(),
    }),
  }),
})
export const valueTransferSolanaTransactionStepSchema = z.object({
  ...userStepFields,
  type: z.literal('TRANSACTION'),
  chainType: z.literal('SOLANA'),
  signerAddress: svmAddressSchema,
  transaction: z.object({
    encoded: z.object({ encoding: z.literal('base64'), data: base64Schema }),
  }),
})
export const valueTransferStellarTransactionStepSchema = z.object({
  ...userStepFields,
  type: z.literal('TRANSACTION'),
  chainType: z.literal('STELLAR'),
  signerAddress: stellarAccountAddressSchema,
  transaction: z.object({
    encoded: z.object({
      operationsXDR: z.array(base64Schema).min(1).max(100),
      inclusionFee: unsignedIntegerSchema,
    }),
  }),
})
export const valueTransferSignatureStepSchema = z.object({
  ...userStepFields,
  type: z.literal('SIGNATURE'),
  signerAddress: evmAddressSchema,
  signature: z.object({
    type: z.literal('EIP712'),
    typedData: z.object({
      primaryType: z.string().min(1),
      domain: z.object({
        name: z.string().optional(),
        version: z.string().optional(),
        chainId: z
          .union([z.number().int().positive(), unsignedIntegerSchema])
          .optional(),
        verifyingContract: evmAddressSchema,
        salt: hexSchema.optional(),
      }),
      types: z.record(
        z.string(),
        z.array(z.object({ name: z.string(), type: z.string() })),
      ),
      message: z.record(z.string(), z.unknown()),
    }),
  }),
})
export const valueTransferUserStepSchema = z.union([
  valueTransferEvmTransactionStepSchema,
  valueTransferSolanaTransactionStepSchema,
  valueTransferStellarTransactionStepSchema,
  valueTransferSignatureStepSchema,
])
export const valueTransferQuoteSchema = z
  .object({
    id: quoteIdSchema,
    srcAmount: unsignedIntegerSchema,
    dstAmount: unsignedIntegerSchema,
    dstAmountMin: unsignedIntegerSchema,
    srcAmountUsd: decimalSchema,
    dstAmountUsd: decimalSchema,
    feeUsd: decimalSchema,
    feePercent: decimalSchema,
    duration: z.object({ estimated: decimalSchema.nullable() }),
    fees: z.array(
      z.object({
        chainKey: chainKeySchema,
        type: z.string().min(1),
        description: z.string(),
        amount: unsignedIntegerSchema,
        address: addressSchema,
      }),
    ),
    routeSteps: z
      .array(
        z.object({
          type: z.string().min(1),
          srcChainKey: chainKeySchema,
          description: z.string(),
        }),
      )
      .min(1),
    userSteps: z.array(valueTransferUserStepSchema).optional(),
    expiresAt: z
      .string()
      .min(1)
      .refine((value) => Number.isFinite(getValueTransferQuoteExpiry(value)))
      .optional(),
    options: z
      .object({ dstNativeDropAmount: unsignedIntegerSchema })
      .optional(),
  })
  .refine(
    (quote) =>
      unsignedIntegerSchema.safeParse(quote.dstAmountMin).success &&
      unsignedIntegerSchema.safeParse(quote.dstAmount).success &&
      BigInt(quote.dstAmountMin) <= BigInt(quote.dstAmount),
    'Invalid minimum output amount',
  )

export const valueTransferQuoteResponseSchema = z.object({
  quotes: z.array(valueTransferQuoteSchema),
  tokens: z.array(valueTransferTokenSchema),
  rejectedQuotes: z.array(z.unknown()).default([]),
})
export const valueTransferBuildUserStepsRequestSchema = z.object({
  quoteId: quoteIdSchema,
})
export const valueTransferBuildUserStepsResponseSchema = z.object({
  userSteps: z.array(valueTransferUserStepSchema).min(1),
})
export const valueTransferSubmitSignatureRequestSchema = z.object({
  quoteId: quoteIdSchema,
  signatures: z
    .array(
      hexSchema.refine((value) => value.length > 2 && value.length <= 4098),
    )
    .min(1)
    .max(20),
})
export const valueTransferSubmitSignatureResponseSchema = z.object({})
export const valueTransferStatusRequestSchema = z.object({
  quoteId: quoteIdSchema,
  txHash: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-zA-Z0-9]+$/)
    .optional(),
})
export const valueTransferStatusResponseSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'UNKNOWN']),
  explorerUrl: z
    .url()
    .refine((value) => value.startsWith('https://'))
    .optional(),
  executionHistory: z
    .array(
      z.object({
        event: z.string().min(1),
        transaction: z.object({
          chainKey: chainKeySchema,
          hash: z.string().min(1),
          timestamp: z.number().finite().optional(),
        }),
      }),
    )
    .optional(),
})

export type ValueTransferToken = z.infer<typeof valueTransferTokenSchema>
export type ValueTransferChain = z.infer<typeof valueTransferChainSchema>
export type ValueTransferChainsResponse = z.infer<
  typeof valueTransferChainsResponseSchema
>
export type ValueTransferTokensRequest = z.infer<
  typeof valueTransferTokensRequestSchema
>
export type ValueTransferTokensResponse = z.infer<
  typeof valueTransferTokensResponseSchema
>
export type ValueTransferMetadataResponse = z.infer<
  typeof valueTransferMetadataResponseSchema
>
export type ValueTransferQuoteRequest = z.infer<
  typeof valueTransferQuoteRequestSchema
>
export type ValueTransferQuote = z.infer<typeof valueTransferQuoteSchema>
export type ValueTransferQuoteResponse = z.infer<
  typeof valueTransferQuoteResponseSchema
>
export type ValueTransferUserStep = z.infer<typeof valueTransferUserStepSchema>
export type ValueTransferEvmTransactionStep = z.infer<
  typeof valueTransferEvmTransactionStepSchema
>
export type ValueTransferSolanaTransactionStep = z.infer<
  typeof valueTransferSolanaTransactionStepSchema
>
export type ValueTransferStellarTransactionStep = z.infer<
  typeof valueTransferStellarTransactionStepSchema
>
export type ValueTransferSignatureStep = z.infer<
  typeof valueTransferSignatureStepSchema
>
export type ValueTransferBuildUserStepsRequest = z.infer<
  typeof valueTransferBuildUserStepsRequestSchema
>
export type ValueTransferBuildUserStepsResponse = z.infer<
  typeof valueTransferBuildUserStepsResponseSchema
>
export type ValueTransferSubmitSignatureRequest = z.infer<
  typeof valueTransferSubmitSignatureRequestSchema
>
export type ValueTransferStatusRequest = z.infer<
  typeof valueTransferStatusRequestSchema
>
export type ValueTransferStatusResponse = z.infer<
  typeof valueTransferStatusResponseSchema
>
