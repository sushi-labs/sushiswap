import type { EvmAddress } from 'sushi/evm'
import { parseAbi } from 'viem'

export const SUSHI_V2_LAUNCHPAD_ADDRESS =
  '0xF1716eBf85836ffE2985db9A50dd29e5814caBe9' satisfies EvmAddress

export const SUSHI_V2_LAUNCHPAD_ABI = parseAbi([
  'function launch((string name, string symbol) tokenConfig, address quoteToken, uint8 liquidityMode, uint8 feeDisposition) payable returns (address token, address pool, uint256[] positionIds)',
  'function launchAndBuy((string name, string symbol) tokenConfig, address quoteToken, uint8 liquidityMode, uint8 feeDisposition, (uint256 amountIn, uint256 amountOutMinimum, address recipient) initialBuy) payable returns (address token, address pool, uint256[] positionIds, uint256 amountOut)',
  'function launchAndBuyNative((string name, string symbol) tokenConfig, uint8 liquidityMode, uint8 feeDisposition, (uint256 amountIn, uint256 amountOutMinimum, address recipient) initialBuy) payable returns (address token, address pool, uint256[] positionIds, uint256 amountOut)',
  'function distributeFees(address token) returns ((uint256 quoteToSushi, uint256 launchTokenToSushi, uint256 quoteToReceiver, uint256 launchTokenToReceiver, uint256 launchTokenFeesBurned, uint256 quoteUsedForBuyback, uint256 launchTokenBoughtAndBurned, int24 priorMeanTick, int24 recentMeanTick, int24 spotTick) result)',
  'function transferCreator(address token, address newCreator)',
  'function setFeeDisposition(address token, uint8 newFeeDisposition)',
  'function launchFee() view returns (uint256)',
  'function defaultSushiFeeBps() view returns (uint16)',
  'function canonicalSushi() view returns (address)',
  'function calculateStartTick(address quoteToken) view returns (int24)',
  'function calculateFdvTick(address quoteToken, uint256 fdvUsd) view returns (int24)',
  'event TokenLaunched(address indexed launchCreator, address indexed token, address indexed pool, address quoteToken, uint8 liquidityMode, uint8 feeDisposition, address initialFeeReceiver, uint16 initialSushiFeeBps, int24 startTick, uint64 poolInitializedAt, uint16 observationCardinalityNext, string name, string symbol)',
  'error NothingToWithdraw()',
  'error UnauthorizedCreator(address caller)',
  'error InvalidFeeDispositionTransition(uint8 previousMode, uint8 newMode)',
  'error ZeroAddress()',
])

export const SUSHI_V2_LIQUIDITY_MODE = {
  STANDARD: 0,
  MOON: 1,
} as const

export const SUSHI_V2_FEE_DISPOSITION = {
  DIRECT_PAYOUT: 0,
  BURN_LAUNCH_TOKEN_FEES: 1,
  BUYBACK_AND_BURN: 2,
} as const

export type SushiV2LiquidityMode = keyof typeof SUSHI_V2_LIQUIDITY_MODE
export type SushiV2FeeDisposition = keyof typeof SUSHI_V2_FEE_DISPOSITION

const SUSHI_V2_FEE_TRANSITIONS = {
  DIRECT_PAYOUT: ['BURN_LAUNCH_TOKEN_FEES', 'BUYBACK_AND_BURN'],
  BURN_LAUNCH_TOKEN_FEES: ['BUYBACK_AND_BURN'],
  BUYBACK_AND_BURN: [],
} as const satisfies Record<
  SushiV2FeeDisposition,
  readonly SushiV2FeeDisposition[]
>

export function getSushiV2FeeDispositionTransitions(
  current: SushiV2FeeDisposition,
): readonly SushiV2FeeDisposition[] {
  return SUSHI_V2_FEE_TRANSITIONS[current]
}

export interface DistributionPreview {
  quoteCollected: bigint
  tokenCollected: bigint
  breakdown?: SushiV2DistributionResult
}

interface SushiV2DistributionResult {
  quoteToSushi: bigint
  launchTokenToSushi: bigint
  quoteToReceiver: bigint
  launchTokenToReceiver: bigint
  launchTokenFeesBurned: bigint
  quoteUsedForBuyback: bigint
  launchTokenBoughtAndBurned: bigint
}

export function normalizeSushiV2Distribution(
  result: SushiV2DistributionResult,
): DistributionPreview {
  return {
    quoteCollected:
      result.quoteToSushi + result.quoteToReceiver + result.quoteUsedForBuyback,
    tokenCollected:
      result.launchTokenToSushi +
      result.launchTokenToReceiver +
      result.launchTokenFeesBurned,
    breakdown: result,
  }
}
