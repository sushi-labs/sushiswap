import { type EvmAddress, isEvmAddress } from 'sushi/evm'
import type { Hex } from 'viem'
import * as z from 'zod'
import {
  type AnyTokenAnyChainDepositChainId,
  isAnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'

// LI.FI routing identifiers, not an EVM network or an ERC-20 on HyperEVM.
export const LIFI_PERPS_CHAIN_ID = 1337
export const LIFI_PERPS_USDC_ADDRESS: EvmAddress =
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
export const LIFI_PERPS_USDC_DECIMALS = 6

const addressSchema = z
  .string()
  .refine(isEvmAddress)
  .transform((address) => address as EvmAddress)
const userAddressSchema = addressSchema.refine(
  (address) => !/^0x0{40}$/i.test(address),
  'A nonzero wallet address is required',
)
const sourceChainSchema = z
  .number()
  .int()
  .refine(
    isAnyTokenAnyChainDepositChainId,
    'Unsupported perps deposit source chain',
  )
  .transform((chainId) => chainId as AnyTokenAnyChainDepositChainId)
const amountSchema = z
  .string()
  .regex(/^[1-9][0-9]{0,77}$/)
  .refine(
    (amount) => BigInt(amount) <= (1n << 256n) - 1n,
    'Amount exceeds uint256',
  )
const quantitySchema = z.string().regex(/^(?:[0-9]+|0x[0-9a-fA-F]+)$/)

export const lifiPerpsRoutesInputSchema = z.strictObject({
  fromChainId: z.coerce.number().pipe(sourceChainSchema),
  fromAmount: amountSchema,
  fromTokenAddress: addressSchema,
  fromAddress: userAddressSchema,
  slippage: z.coerce.number().min(0).max(0.5),
})
export type LifiPerpsRoutesInput = z.infer<typeof lifiPerpsRoutesInputSchema>

const tokenSchema = z
  .object({
    address: addressSchema,
    chainId: z.number().int(),
    decimals: z.number().int().min(0).max(255),
    symbol: z.string(),
    name: z.string(),
    priceUSD: z.string().optional(),
    logoURI: z.string().optional(),
  })
  .passthrough()

const perpsTokenSchema = tokenSchema.extend({
  chainId: z.literal(LIFI_PERPS_CHAIN_ID),
  decimals: z.literal(LIFI_PERPS_USDC_DECIMALS),
  address: addressSchema.refine(
    (address) => sameAddress(address, LIFI_PERPS_USDC_ADDRESS),
    'Expected HyperCore perps USDC',
  ),
})

const actionSchema = z
  .object({
    fromChainId: sourceChainSchema,
    fromToken: tokenSchema,
    fromAmount: amountSchema,
    fromAddress: userAddressSchema,
    toChainId: z.literal(LIFI_PERPS_CHAIN_ID),
    toToken: perpsTokenSchema,
    toAddress: userAddressSchema,
    slippage: z.number().min(0).max(0.5),
  })
  .passthrough()
  .refine(
    (action) =>
      action.fromToken.chainId === action.fromChainId &&
      sameAddress(action.fromAddress, action.toAddress),
    'Deposit must credit the source wallet on HyperCore',
  )

const transactionSchema = z.object({
  chainId: sourceChainSchema,
  from: userAddressSchema,
  to: userAddressSchema,
  data: z
    .string()
    .regex(/^0x(?:[0-9a-fA-F]{2}){4,}$/)
    .transform((data) => data as Hex),
  value: quantitySchema,
  gasPrice: quantitySchema.optional(),
  gasLimit: quantitySchema.optional(),
  maxFeePerGas: quantitySchema.optional(),
  maxPriorityFeePerGas: quantitySchema.optional(),
})

const costSchema = z
  .object({
    name: z.string().optional(),
    amount: quantitySchema,
    amountUSD: z.string(),
    token: tokenSchema,
  })
  .passthrough()

const stepBaseSchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(['lifi', 'cross']),
    tool: z.string().min(1),
    toolDetails: z
      .object({
        key: z.string(),
        name: z.string(),
        logoURI: z.string(),
      })
      .passthrough(),
    action: actionSchema,
    estimate: z
      .object({
        fromAmount: amountSchema,
        toAmount: amountSchema,
        toAmountMin: amountSchema,
        approvalAddress: addressSchema,
        executionDuration: z.number().finite().nonnegative(),
        feeCosts: z.array(costSchema).optional(),
        gasCosts: z.array(costSchema).optional(),
        skipApproval: z.boolean().optional(),
      })
      .passthrough(),
    executionType: z.literal('transaction').optional(),
    // Preserve LI.FI's protocol-specific payload for stepTransaction.
    includedSteps: z.array(z.record(z.string(), z.unknown())).min(1),
    includedStepsWithoutFees: z
      .array(z.record(z.string(), z.unknown()))
      .optional(),
    transactionRequest: transactionSchema.optional(),
    integrator: z.literal('sushi').optional(),
    typedData: z.array(z.unknown()).max(0).optional(),
  })
  .passthrough()

export const lifiPerpsStepSchema = stepBaseSchema.refine(
  isEligibleStep,
  'Expected a single source transaction depositing directly into perps',
)
export type LifiPerpsStep = z.infer<typeof lifiPerpsStepSchema>

export const lifiPerpsPreparedStepSchema = stepBaseSchema
  .extend({
    transactionRequest: transactionSchema,
  })
  .refine(isEligibleStep, 'Invalid prepared perps deposit transaction')
export type LifiPerpsPreparedStep = z.infer<typeof lifiPerpsPreparedStepSchema>

const routeBaseSchema = z.object({
  id: z.string().min(1),
  fromChainId: sourceChainSchema,
  fromAmount: amountSchema,
  fromToken: tokenSchema,
  fromAddress: userAddressSchema,
  toChainId: z.literal(LIFI_PERPS_CHAIN_ID),
  toAmount: amountSchema,
  toAmountMin: amountSchema,
  toToken: perpsTokenSchema,
  toAddress: userAddressSchema,
  gasCostUSD: z.string().optional(),
  containsSwitchChain: z.literal(false).optional(),
})

export const lifiPerpsRouteSchema = routeBaseSchema
  .extend({
    step: lifiPerpsStepSchema,
  })
  .refine((route) => matchesRoute(route), 'Route and step disagree')
export type LifiPerpsRoute = z.infer<typeof lifiPerpsRouteSchema>
export const lifiPerpsRoutesResponseSchema = z.object({
  routes: z.array(lifiPerpsRouteSchema),
})

const upstreamRouteSchema = routeBaseSchema
  .extend({
    steps: z.array(lifiPerpsStepSchema).length(1),
  })
  .transform(({ steps, ...route }) => ({ ...route, step: steps[0] }))
  .refine((route) => matchesRoute(route), 'Route and step disagree')

export function sameAddress(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase()
}

function isEligibleStep(step: z.infer<typeof stepBaseSchema>): boolean {
  const { action, estimate, transactionRequest } = step
  if (
    estimate.fromAmount !== action.fromAmount ||
    BigInt(estimate.toAmountMin) > BigInt(estimate.toAmount)
  )
    return false
  if (
    transactionRequest &&
    (transactionRequest.chainId !== action.fromChainId ||
      !sameAddress(transactionRequest.from, action.fromAddress))
  )
    return false

  return (
    step.includedSteps.some((included) => {
      const action = included.action
      return (
        typeof action === 'object' &&
        action !== null &&
        'toChainId' in action &&
        action.toChainId === LIFI_PERPS_CHAIN_ID
      )
    }) &&
    [...step.includedSteps, ...(step.includedStepsWithoutFees ?? [])].every(
      (included) =>
        isEmbeddedStep(included, action.fromChainId, action.toAddress),
    )
  )
}

function isEmbeddedStep(
  step: Record<string, unknown>,
  sourceChainId: number,
  recipient: EvmAddress,
): boolean {
  if (step.executionType !== undefined && step.executionType !== 'transaction')
    return false
  if (step.transactionRequest !== undefined || step.typedData !== undefined)
    return false
  const parsed = z
    .object({
      action: z.object({
        fromChainId: z.number().int(),
        toChainId: z.number().int(),
        toAddress: addressSchema.optional(),
        toToken: tokenSchema,
      }),
      includedSteps: z.array(z.record(z.string(), z.unknown())).optional(),
    })
    .safeParse(step)
  if (!parsed.success) return false
  const { action, includedSteps } = parsed.data
  if (action.fromChainId !== sourceChainId) return false
  if (
    action.toChainId !== sourceChainId &&
    action.toChainId !== LIFI_PERPS_CHAIN_ID
  )
    return false
  if (
    action.toChainId === LIFI_PERPS_CHAIN_ID &&
    (!perpsTokenSchema.safeParse(action.toToken).success ||
      !action.toAddress ||
      !sameAddress(action.toAddress, recipient))
  )
    return false
  return (
    !includedSteps ||
    includedSteps.every((included) =>
      isEmbeddedStep(included, sourceChainId, recipient),
    )
  )
}

function matchesRoute(
  route: z.infer<typeof routeBaseSchema> & {
    step: LifiPerpsStep
  },
): boolean {
  const { action, estimate } = route.step
  return (
    route.fromChainId === action.fromChainId &&
    route.fromToken.chainId === action.fromChainId &&
    sameAddress(route.fromToken.address, action.fromToken.address) &&
    sameAddress(route.fromAddress, action.fromAddress) &&
    sameAddress(route.toAddress, action.toAddress) &&
    route.fromAmount === action.fromAmount &&
    route.toAmount === estimate.toAmount &&
    route.toAmountMin === estimate.toAmountMin
  )
}

export function parseLifiPerpsRoutes(
  routes: unknown[],
  input: LifiPerpsRoutesInput,
): LifiPerpsRoute[] {
  return routes
    .flatMap((route) => {
      const parsed = upstreamRouteSchema.safeParse(route)
      if (!parsed.success) return []
      const { action } = parsed.data.step
      if (
        action.fromChainId !== input.fromChainId ||
        action.fromAmount !== input.fromAmount ||
        !sameAddress(action.fromToken.address, input.fromTokenAddress) ||
        !sameAddress(action.fromAddress, input.fromAddress) ||
        action.slippage !== input.slippage
      )
        return []
      return [parsed.data]
    })
    .sort(
      (left, right) =>
        left.step.estimate.executionDuration -
        right.step.estimate.executionDuration,
    )
}

export function matchesPreparedPerpsStep(
  prepared: LifiPerpsPreparedStep,
  requested: LifiPerpsStep,
): boolean {
  return (
    prepared.id === requested.id &&
    prepared.action.fromChainId === requested.action.fromChainId &&
    prepared.action.fromAmount === requested.action.fromAmount &&
    prepared.action.slippage === requested.action.slippage &&
    sameAddress(
      prepared.action.fromToken.address,
      requested.action.fromToken.address,
    ) &&
    sameAddress(prepared.action.fromAddress, requested.action.fromAddress) &&
    sameAddress(prepared.action.toAddress, requested.action.toAddress) &&
    sameAddress(
      prepared.estimate.approvalAddress,
      requested.estimate.approvalAddress,
    ) &&
    BigInt(prepared.estimate.toAmountMin) >=
      BigInt(requested.estimate.toAmountMin)
  )
}
