import { EVM_UI_FEE_DECIMAL, XSWAP_STABLE_UI_FEE_DECIMAL } from 'src/config'
import { type EvmAddress, STABLES } from 'sushi/evm'
import * as z from 'zod'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
  type LifiPerpsPreparedStep,
  type LifiPerpsRoute,
  type LifiPerpsRoutesInput,
  type LifiPerpsStep,
  lifiPerpsPreparedStepSchema,
  matchesPreparedPerpsStep,
  parseLifiPerpsRoutes,
  sameAddress,
} from './lifi-perps-schemas'

interface LifiPerpsRoutesRequest
  extends Omit<LifiPerpsRoutesInput, 'slippage'> {
  toChainId: typeof LIFI_PERPS_CHAIN_ID
  toTokenAddress: EvmAddress
  toAddress: EvmAddress
  options: {
    slippage: number
    order: 'FASTEST'
    integrator: 'sushi'
    exchanges: { allow: ['sushiswap'] }
    allowSwitchChain: false
    allowDestinationCall: true
    fee: number
  }
}

export function getLifiPerpsRoutesRequest(
  input: LifiPerpsRoutesInput,
): LifiPerpsRoutesRequest {
  const { slippage, ...source } = input
  const fee = STABLES[input.fromChainId]?.some((token) =>
    sameAddress(token.address, input.fromTokenAddress),
  )
    ? XSWAP_STABLE_UI_FEE_DECIMAL
    : EVM_UI_FEE_DECIMAL

  return {
    ...source,
    toChainId: LIFI_PERPS_CHAIN_ID,
    toTokenAddress: LIFI_PERPS_USDC_ADDRESS,
    toAddress: input.fromAddress,
    options: {
      slippage,
      order: 'FASTEST',
      integrator: 'sushi',
      exchanges: { allow: ['sushiswap'] },
      allowSwitchChain: false,
      allowDestinationCall: true,
      fee,
    },
  }
}

export function parseLifiPerpsRoutesResponse(
  value: unknown,
  input: LifiPerpsRoutesInput,
): { routes: LifiPerpsRoute[] } {
  const response = z.object({ routes: z.array(z.unknown()) }).parse(value)
  return { routes: parseLifiPerpsRoutes(response.routes, input) }
}

export function getLifiPerpsStepRequest(step: LifiPerpsStep): LifiPerpsStep {
  // Always prepare through LI.FI; a supplied transaction cannot bypass it.
  const { transactionRequest: _transaction, ...request } = step
  return { ...request, integrator: 'sushi' }
}

export function parseLifiPerpsPreparedStep(
  value: unknown,
  requested: LifiPerpsStep,
): LifiPerpsPreparedStep {
  const prepared = lifiPerpsPreparedStepSchema.parse(value)
  if (!matchesPreparedPerpsStep(prepared, requested)) {
    throw new Error('Perps deposit changed. Request a new quote.')
  }
  return prepared
}
