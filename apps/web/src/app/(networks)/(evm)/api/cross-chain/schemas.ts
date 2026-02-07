import { type XSwapSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { type EvmChainId, isEvmAddress, isEvmChainId } from 'sushi/evm'
import {
  SvmChainId,
  type SvmChainId as SvmChainIdType,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import type { Hex } from 'viem'
import * as z from 'zod'

type ChainIdGuard<TChainId extends number> = (
  chainId: number,
) => chainId is TChainId

type SchemaFlavor = 'sushi' | 'lifi'

function chainIdSchema<TChainId extends number>({
  coerce = false,
  isChainId,
  message = 'chainId must exist in XSwapSupportedChainId',
}: {
  coerce?: boolean
  isChainId: ChainIdGuard<TChainId>
  message?: string
}) {
  const schema = coerce ? z.coerce.number() : z.number()

  return schema
    .refine((chainId): chainId is TChainId => isChainId(chainId), {
      message,
    })
    .transform((chainId) => chainId as TChainId)
}

export const LIFI_SOLANA_CHAIN_ID = 1151111081099710 as const

type LifiChainId = XSwapSupportedChainId | typeof LIFI_SOLANA_CHAIN_ID
type SushiEvmChainId = XSwapSupportedChainId & EvmChainId
type SushiSvmChainId = XSwapSupportedChainId & SvmChainIdType

type ChainIdForFlavor<TFlavor extends SchemaFlavor> = TFlavor extends 'sushi'
  ? XSwapSupportedChainId
  : LifiChainId

type SushiToLifiChainId<TChainId extends LifiChainId | XSwapSupportedChainId> =
  TChainId extends SushiSvmChainId ? typeof LIFI_SOLANA_CHAIN_ID : TChainId

export function sushiToLifiChainId<TChainId extends XSwapSupportedChainId>(
  chainId: TChainId,
): SushiToLifiChainId<TChainId> {
  if (isSvmChainId(chainId)) {
    return LIFI_SOLANA_CHAIN_ID as SushiToLifiChainId<TChainId>
  }
  if (isXSwapSupportedChainId(chainId)) {
    return chainId as SushiToLifiChainId<TChainId>
  }
  throw new Error('chainId not supported in XSwapSupportedChainId')
}

type LifiToSushiChainId<TChainId extends LifiChainId> =
  TChainId extends typeof LIFI_SOLANA_CHAIN_ID ? SvmChainId : TChainId

export function lifiToSushiChainId<TChainId extends LifiChainId>(
  chainId: TChainId,
) {
  if (chainId === LIFI_SOLANA_CHAIN_ID) {
    return SvmChainId.SOLANA
  }
  if (isXSwapSupportedChainId(chainId)) {
    return chainId
  }
  throw new Error('chainId not supported in XSwapSupportedChainId')
}

function isLifiChainId(chainId: number): chainId is LifiChainId {
  return chainId === LIFI_SOLANA_CHAIN_ID || isXSwapSupportedChainId(chainId)
}

function isLifiSvmChainId(
  chainId: number,
): chainId is typeof LIFI_SOLANA_CHAIN_ID | SushiSvmChainId {
  return chainId === LIFI_SOLANA_CHAIN_ID || isSvmChainId(chainId)
}

const _sushiChainIdSchema = chainIdSchema({
  coerce: true,
  isChainId: isXSwapSupportedChainId,
})

const _sushiEvmChainIdSchema = chainIdSchema({
  coerce: true,
  isChainId: (chainId): chainId is SushiEvmChainId =>
    isXSwapSupportedChainId(chainId) && isEvmChainId(chainId),
})

const _sushiSvmChainIdSchema = chainIdSchema({
  coerce: true,
  isChainId: (chainId): chainId is SushiSvmChainId =>
    isXSwapSupportedChainId(chainId) && isSvmChainId(chainId),
})

type SushiChainIdSchema<TChainId extends XSwapSupportedChainId | undefined> =
  TChainId extends undefined
    ? typeof _sushiChainIdSchema
    : TChainId extends SvmChainId
      ? typeof _sushiSvmChainIdSchema
      : typeof _sushiEvmChainIdSchema

function sushiChainIdSchema<TChainId extends XSwapSupportedChainId | undefined>(
  chainId?: TChainId,
): SushiChainIdSchema<TChainId> {
  if (!chainId) {
    return chainIdSchema({
      coerce: true,
      isChainId: isXSwapSupportedChainId,
    }) as SushiChainIdSchema<TChainId>
  }

  if (isSvmChainId(chainId)) {
    return _sushiSvmChainIdSchema as SushiChainIdSchema<TChainId>
  }

  return _sushiEvmChainIdSchema as SushiChainIdSchema<TChainId>
}

const _lifiChainIdSchema = chainIdSchema({
  isChainId: isLifiChainId,
})

const _lifiEvmChainIdSchema = chainIdSchema({
  isChainId: (chainId): chainId is SushiEvmChainId =>
    isLifiChainId(chainId) && isEvmChainId(chainId),
})

const _lifiSvmChainIdSchema = chainIdSchema({
  isChainId: isLifiSvmChainId,
}).transform((chainId) => {
  if (chainId === LIFI_SOLANA_CHAIN_ID) {
    return SvmChainId.SOLANA
  }

  return chainId as SushiSvmChainId
})

type LifiChainIdSchema<TChainId extends LifiChainId | undefined> =
  TChainId extends undefined
    ? typeof _lifiChainIdSchema
    : TChainId extends typeof LIFI_SOLANA_CHAIN_ID
      ? typeof _lifiSvmChainIdSchema
      : typeof _lifiEvmChainIdSchema

function lifiChainIdSchema<TChainId extends LifiChainId | undefined>(
  chainId?: TChainId,
): LifiChainIdSchema<TChainId> {
  if (!chainId) {
    return _lifiChainIdSchema as LifiChainIdSchema<TChainId>
  }
  if (isLifiSvmChainId(chainId)) {
    return _lifiSvmChainIdSchema as LifiChainIdSchema<TChainId>
  }
  return _lifiEvmChainIdSchema as LifiChainIdSchema<TChainId>
}

function getAddressValidator(
  chainId: number,
  isSvmChainIdFn: (chainId: number) => boolean = isSvmChainId,
) {
  return isSvmChainIdFn(chainId) ? isSvmAddress : isEvmAddress
}

function getAddressSchema<TChainId extends XSwapSupportedChainId | LifiChainId>(
  chainId: TChainId,
  {
    isSvmChainIdFn = isSvmChainId,
  }: {
    isSvmChainIdFn?: (chainId: number) => boolean
  } = {},
) {
  return z
    .string()
    .refine(getAddressValidator(chainId, isSvmChainIdFn), {
      error: 'Invalid address format for the specified chainId',
    })
    .transform((address) => address as AddressFor<LifiToSushiChainId<TChainId>>)
}

type NormalizedChainIdForFlavor<
  TChainId extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
> = TFlavor extends 'sushi'
  ? SushiToLifiChainId<TChainId & XSwapSupportedChainId>
  : LifiToSushiChainId<TChainId & LifiChainId>

type FlavorConfig<
  TChainId extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
> = {
  chainIdSchema: TFlavor extends 'sushi'
    ? SushiChainIdSchema<TChainId & XSwapSupportedChainId>
    : LifiChainIdSchema<TChainId & LifiChainId>
  isSvmChainIdFn: (chainId: number) => boolean
  normalizeChainId: TFlavor extends 'sushi'
    ? (
        chainId: XSwapSupportedChainId,
      ) => NormalizedChainIdForFlavor<TChainId, TFlavor>
    : (chainId: LifiChainId) => NormalizedChainIdForFlavor<TChainId, TFlavor>
}

function getFlavorConfig<
  TChainId extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(chainId: TChainId, flavor: TFlavor): FlavorConfig<TChainId, TFlavor> {
  if (flavor === 'sushi') {
    const _chainId = chainId as TChainId & XSwapSupportedChainId
    return {
      chainIdSchema: sushiChainIdSchema(_chainId) as FlavorConfig<
        TChainId,
        TFlavor
      >['chainIdSchema'],
      isSvmChainIdFn: isSvmChainId,
      normalizeChainId: sushiToLifiChainId as FlavorConfig<
        TChainId,
        TFlavor
      >['normalizeChainId'],
    }
  }

  const _chainId = chainId as TChainId & LifiChainId
  return {
    chainIdSchema: lifiChainIdSchema(_chainId) as FlavorConfig<
      TChainId,
      TFlavor
    >['chainIdSchema'],
    isSvmChainIdFn: isLifiSvmChainId,
    normalizeChainId: lifiToSushiChainId as FlavorConfig<
      TChainId,
      TFlavor
    >['normalizeChainId'],
  }
}

function estimateSchema<
  TChainId0 extends ChainIdForFlavor<TFlavor>,
  TChainId1 extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(fromChainId: TChainId0, toChainId: TChainId1, flavor: TFlavor) {
  const estimateTokenSchema = z.union([
    tokenSchema(fromChainId, flavor),
    tokenSchema(toChainId, flavor),
  ])

  return z.object({
    tool: z.string(),
    fromAmount: z.string(),
    fromAmountUSD: z.string().optional(),
    toAmount: z.string(),
    toAmountMin: z.string(),
    toAmountUSD: z.string().optional(),
    approvalAddress: z.union([getAddressSchema(1), getAddressSchema(-5)]),
    feeCosts: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          percentage: z.string(),
          token: estimateTokenSchema,
          amount: z.string(),
          amountUSD: z.string(),
          included: z.boolean(),
        }),
      )
      .optional()
      .default([]),
    gasCosts: z
      .array(
        z.object({
          type: z.enum(['SUM', 'APPROVE', 'SEND', 'FEE']),
          price: z.string(),
          estimate: z.string(),
          limit: z.string(),
          amount: z.string(),
          amountUSD: z.string(),
          token: estimateTokenSchema,
        }),
      )
      .optional()
      .default([]),
    executionDuration: z.number(),
    approvalReset: z.boolean().optional(),
    skipApproval: z.boolean().optional(),
    skipPermit: z.boolean().optional(),
  })
}

function transactionRequestSchema<
  TChainId extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(
  chainId: TChainId,
  flavor: TFlavor,
): z.ZodType<
  TChainId extends SvmChainId | typeof LIFI_SOLANA_CHAIN_ID
    ? {
        data: string
      }
    : {
        to?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>> | null
        from?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>>
        data?: Hex
        value?: string
        gasPrice?: string
      }
> {
  const config = getFlavorConfig(chainId, flavor)

  if (config.isSvmChainIdFn(chainId)) {
    return z.object({
      data: z.string(),
    }) as unknown as z.ZodType<
      TChainId extends SvmChainId | typeof LIFI_SOLANA_CHAIN_ID
        ? {
            data: string
          }
        : {
            to?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>> | null
            from?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>>
            data?: Hex
            value?: string
            gasPrice?: string
          }
    >
  }

  return z.object({
    to: getAddressSchema(chainId, {
      isSvmChainIdFn: config.isSvmChainIdFn,
    })
      .nullable()
      .optional(),
    from: getAddressSchema(chainId, {
      isSvmChainIdFn: config.isSvmChainIdFn,
    }).optional(),
    data: z
      .string()
      .regex(/^0x[a-fA-F0-9]*$/)
      .transform((data) => data as Hex)
      .optional(),
    value: z.string().optional(),
    gasPrice: z.string().optional(),
  }) as unknown as z.ZodType<
    TChainId extends SvmChainId | typeof LIFI_SOLANA_CHAIN_ID
      ? {
          data: string
        }
      : {
          to?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>> | null
          from?: AddressFor<LifiToSushiChainId<TChainId & LifiChainId>>
          data?: Hex
          value?: string
          gasPrice?: string
        }
  >
}

const toolDetailsSchema = z.object({
  key: z.string(),
  name: z.string(),
  logoURI: z.string(),
})

const crossChainTypeSchema = z.enum(['swap', 'cross', 'lifi', 'protocol'])
const executionTypeSchema = z.enum(['transaction', 'message', 'all'])
const typedDataSchema = z.record(z.string(), z.unknown())

function stepBaseSchema<
  TChainId0 extends ChainIdForFlavor<TFlavor>,
  TChainId1 extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(fromChainId: TChainId0, toChainId: TChainId1, flavor: TFlavor) {
  return z.object({
    id: z.string(),
    type: crossChainTypeSchema,
    tool: z.string(),
    toolDetails: toolDetailsSchema,
    integrator: z.string().optional(),
    referrer: z.string().optional(),
    action: actionSchema(fromChainId, toChainId, flavor),
    estimate: estimateSchema(fromChainId, toChainId, flavor),
    executionType: executionTypeSchema.optional(),
    transactionRequest: transactionRequestSchema(
      fromChainId,
      flavor,
    ).optional(),
    transactionId: z.string().optional(),
    typedData: z.array(typedDataSchema).optional(),
  })
}

function stepSchema<
  TChainId0 extends ChainIdForFlavor<TFlavor>,
  TChainId1 extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(fromChainId: TChainId0, toChainId: TChainId1, flavor: TFlavor) {
  const multichainSteps = z.array(
    z.union([
      stepBaseSchema(fromChainId, fromChainId, flavor),
      stepBaseSchema(fromChainId, toChainId, flavor),
      stepBaseSchema(toChainId, toChainId, flavor),
    ]),
  )

  return stepBaseSchema(fromChainId, toChainId, flavor).extend({
    // We only need to pass nested step payloads through.
    includedSteps: multichainSteps,
    includedStepsWithoutFees: multichainSteps.optional(),
  })
}

type Step<
  TChainId0 extends ChainIdForFlavor<TFlavor>,
  TChainId1 extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
> = z.infer<ReturnType<typeof stepSchema<TChainId0, TChainId1, TFlavor>>>

function tokenSchema<
  TChainId extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(chainId: TChainId, flavor: TFlavor) {
  const config = getFlavorConfig(chainId, flavor)

  return z.object({
    address: getAddressSchema(chainId, {
      isSvmChainIdFn: config.isSvmChainIdFn,
    }),
    chainId: config.chainIdSchema.transform(
      (c) =>
        config.normalizeChainId(c) as NormalizedChainIdForFlavor<
          TChainId,
          TFlavor
        >,
    ),
    decimals: z.number(),
    symbol: z.string(),
    name: z.string(),
    priceUSD: z.string(),
    logoURI: z.string().optional(),
    coinKey: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
}

function actionSchema<
  TChainId0 extends ChainIdForFlavor<TFlavor>,
  TChainId1 extends ChainIdForFlavor<TFlavor>,
  TFlavor extends SchemaFlavor,
>(fromChainId: TChainId0, toChainId: TChainId1, flavor: TFlavor) {
  const fromConfig = getFlavorConfig(fromChainId, flavor)
  const toConfig = getFlavorConfig(toChainId, flavor)

  return z.object({
    fromChainId: fromConfig.chainIdSchema.transform(
      (c) =>
        fromConfig.normalizeChainId(c) as NormalizedChainIdForFlavor<
          TChainId0,
          TFlavor
        >,
    ),
    fromAmount: z.string(),
    fromToken: tokenSchema(fromChainId, flavor),
    toChainId: toConfig.chainIdSchema.transform(
      (c) =>
        toConfig.normalizeChainId(c) as NormalizedChainIdForFlavor<
          TChainId1,
          TFlavor
        >,
    ),
    toToken: tokenSchema(toChainId, flavor),
    slippage: z.number().optional(),
    fromAddress: getAddressSchema(fromChainId, {
      isSvmChainIdFn: fromConfig.isSvmChainIdFn,
    }).optional(),
    toAddress: getAddressSchema(toChainId, {
      isSvmChainIdFn: toConfig.isSvmChainIdFn,
    }).optional(),
  })
}

export {
  type LifiChainId,
  getAddressSchema,
  lifiChainIdSchema,
  sushiChainIdSchema,
  stepSchema,
  type Step,
  tokenSchema,
  transactionRequestSchema,
}
