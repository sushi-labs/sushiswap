import { type SvmAddress, isSvmAddress } from 'sushi/svm'
import * as z from 'zod'

const svmAddressSchema = z
  .string()
  .refine(isSvmAddress)
  .transform((address) => address as SvmAddress)

export const svmSwapModeSchema = z.enum(['ExactIn', 'ExactOut'])

export type SvmOrder = {
  mode: string
  inputMint: SvmAddress
  outputMint: SvmAddress
  inAmount: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: SvmSwapMode
  slippageBps: number
  inUsdValue?: number
  outUsdValue?: number
  priceImpact?: number
  swapUsdValue?: number
  routePlan: unknown[]
  feeMint?: SvmAddress
  feeBps: number
  signatureFeeLamports: number
  prioritizationFeeLamports: number
  rentFeeLamports: number
  router: 'iris' | 'jupiterz' | 'dflow' | 'okx'
  transaction?: string | null
  gasless: boolean
  requestId: string
  totalTime: number
  taker?: SvmAddress | null
  quoteId?: string
  maker?: SvmAddress
  expireAt?: string
  platformFee?: {
    feeMint: SvmAddress
    feeBps: number
  }
  advancedFee?: {
    feeBps: string
    feeMint: SvmAddress
    feeReceiver: SvmAddress
    feeUsdValue: number
  }
  errorCode?: number
  errorMessage?: string
}

const svmOrderSchema: z.ZodType<SvmOrder> = z
  .object({
    mode: z.string(),
    inputMint: svmAddressSchema,
    outputMint: svmAddressSchema,
    inAmount: z.string(),
    outAmount: z.string(),
    otherAmountThreshold: z.string(),
    swapMode: svmSwapModeSchema,
    slippageBps: z.coerce.number().int(),
    inUsdValue: z.coerce.number().optional(),
    outUsdValue: z.coerce.number().optional(),
    priceImpact: z.coerce.number().optional(),
    swapUsdValue: z.coerce.number().optional(),
    routePlan: z.array(z.unknown()),
    feeMint: svmAddressSchema.optional(),
    feeBps: z.coerce.number(),
    signatureFeeLamports: z.coerce.number(),
    prioritizationFeeLamports: z.coerce.number(),
    rentFeeLamports: z.coerce.number(),
    router: z.enum(['iris', 'jupiterz', 'dflow', 'okx']),
    transaction: z.string().nullable().optional(),
    gasless: z.boolean(),
    requestId: z.string(),
    totalTime: z.coerce.number(),
    taker: svmAddressSchema.nullable().optional(),
    quoteId: z.string().optional(),
    maker: svmAddressSchema.optional(),
    expireAt: z.string().optional(),
    platformFee: z
      .object({
        feeMint: svmAddressSchema,
        feeBps: z.coerce.number(),
      })
      .optional(),
    advancedFee: z
      .object({
        feeBps: z.string(),
        feeMint: svmAddressSchema,
        feeReceiver: svmAddressSchema,
        feeUsdValue: z.coerce.number(),
      })
      .optional(),
    errorCode: z.coerce.number().optional(),
    errorMessage: z.string().optional(),
  })
  .catchall(z.unknown())

export type SvmExecute = {
  status: 'Success' | 'Failed'
  signature?: string
  slot?: string
  error?: string
  code: number
  totalInputAmount?: string
  totalOutputAmount?: string
  inputAmountResult?: string
  outputAmountResult?: string
  swapEvents?: {
    inputMint: SvmAddress
    inputAmount: string
    outputMint: SvmAddress
    outputAmount: string
  }[]
  [key: string]: unknown
}

const svmExecuteSchema: z.ZodType<SvmExecute> = z
  .object({
    status: z.enum(['Success', 'Failed']),
    signature: z.string().optional(),
    slot: z.string().optional(),
    error: z.string().optional(),
    code: z.coerce.number(),
    totalInputAmount: z.string().optional(),
    totalOutputAmount: z.string().optional(),
    inputAmountResult: z.string().optional(),
    outputAmountResult: z.string().optional(),
    swapEvents: z
      .array(
        z.object({
          inputMint: svmAddressSchema,
          inputAmount: z.string(),
          outputMint: svmAddressSchema,
          outputAmount: z.string(),
        }),
      )
      .optional(),
  })
  .catchall(z.unknown())

export const svmOrderValidator = svmOrderSchema
export const svmExecuteValidator = svmExecuteSchema

export type SvmSwapMode = z.infer<typeof svmSwapModeSchema>
export type SvmOrderResponse = z.infer<typeof svmOrderSchema>
export type SvmExecuteResponse = z.infer<typeof svmExecuteSchema>
