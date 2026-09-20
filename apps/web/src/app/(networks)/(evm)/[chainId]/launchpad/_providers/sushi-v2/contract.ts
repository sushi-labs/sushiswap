import {
  type EvmAddress,
  LAUNCHPAD_V2_FACTORIES,
  type LaunchpadV2ChainId,
} from 'sushi/evm'
import { parseAbi } from 'viem'

export function getSushiV2LaunchpadAddress(
  chainId: LaunchpadV2ChainId,
): EvmAddress {
  return LAUNCHPAD_V2_FACTORIES[chainId][0].address
}

export const SUSHI_V2_LAUNCHPAD_ABI = parseAbi([
  'function launch((string name, string symbol) tokenConfig, address quoteToken, uint8 liquidityMode, uint8 feeDisposition) payable returns (address token, address pool, uint256[] positionIds)',
  'function launchAndBuy((string name, string symbol) tokenConfig, address quoteToken, uint8 liquidityMode, uint8 feeDisposition, (uint256 amountIn, uint256 amountOutMinimum, address recipient) initialBuy) payable returns (address token, address pool, uint256[] positionIds, uint256 amountOut)',
  'function launchAndBuyNative((string name, string symbol) tokenConfig, uint8 liquidityMode, uint8 feeDisposition, (uint256 amountIn, uint256 amountOutMinimum, address recipient) initialBuy) payable returns (address token, address pool, uint256[] positionIds, uint256 amountOut)',
  'function distributeFees(address token) returns ((uint256 quoteToSushi, uint256 launchTokenToSushi, uint256 quoteToReceiver, uint256 launchTokenToReceiver, uint256 launchTokenFeesBurned, uint256 quoteUsedForBuyback, uint256 launchTokenBoughtAndBurned, int24 priorMeanTick, int24 recentMeanTick, int24 spotTick) result)',
  'function transferCreator(address token, address newCreator)',
  'function setFeeReceiver(address token, address newFeeReceiver)',
  'function setFeeDisposition(address token, uint8 newFeeDisposition)',
  'function launchInfo(address token) view returns ((address creator, address feeReceiver, address quoteToken, address pool, address custodian, uint8 liquidityMode, uint8 feeDisposition, uint16 sushiFeeBps, uint64 poolInitializedAt, bool supportsHolderRewards, address rewardDistributor) info)',
  'function owner() view returns (address)',
  'function launchFee() view returns (uint256)',
  'function defaultSushiFeeBps() view returns (uint16)',
  'function canonicalSushi() view returns (address)',
  'function calculateStartTick(address quoteToken) view returns (int24)',
  'function calculateFdvTick(address quoteToken, uint256 fdvUsd) view returns (int24)',
  'event TokenLaunched(address indexed launchCreator, address indexed token, address indexed pool, address quoteToken, uint8 liquidityMode, uint8 feeDisposition, address initialFeeReceiver, uint16 initialSushiFeeBps, int24 startTick, uint64 poolInitializedAt, uint16 observationCardinalityNext, string name, string symbol)',
  'error NothingToWithdraw()',
  'error UnauthorizedCreator(address caller)',
  'error InvalidFeeDispositionTransition(uint8 previousMode, uint8 newMode)',
  'error HolderRewardsUnsupported(address token)',
  'error ZeroAddress()',
])

export const HOLDER_REWARDS_ABI = parseAbi([
  'function earned(address holder) view returns (uint256)',
  'function rewardRateScaled() view returns (uint256)',
  'function periodFinish() view returns (uint256)',
  'function PRECISION() view returns (uint256)',
  'function eligibleSupply() view returns (uint256)',
  'function claim(address holder) returns (uint256 amount)',
])

export const SUSHI_V2_LIQUIDITY_MODE = {
  STANDARD: 0,
  MOON: 1,
} as const

export const SUSHI_V2_FEE_DISPOSITION = {
  DIRECT_PAYOUT: 0,
  BURN_LAUNCH_TOKEN_FEES: 1,
  BUYBACK_AND_BURN: 2,
  DISTRIBUTE_TO_HOLDERS: 3,
} as const

export type SushiV2LiquidityMode = keyof typeof SUSHI_V2_LIQUIDITY_MODE
export type SushiV2FeeDisposition = keyof typeof SUSHI_V2_FEE_DISPOSITION

/** Enum order; buyback and holder rewards are separate permanent choices. */
export const SUSHI_V2_FEE_DISPOSITION_ORDER = [
  'DIRECT_PAYOUT',
  'BURN_LAUNCH_TOKEN_FEES',
  'BUYBACK_AND_BURN',
  'DISTRIBUTE_TO_HOLDERS',
] as const satisfies readonly SushiV2FeeDisposition[]

export const SUSHI_V2_FEE_DISPOSITION_LABELS = {
  DIRECT_PAYOUT: 'Direct payout',
  BURN_LAUNCH_TOKEN_FEES: 'Burn token fees',
  BUYBACK_AND_BURN: 'Buyback & burn',
  DISTRIBUTE_TO_HOLDERS: 'Distribute to holders',
} as const satisfies Record<SushiV2FeeDisposition, string>

export const SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS = {
  DIRECT_PAYOUT: 'Both fee sides are paid out to the fee receiver.',
  BURN_LAUNCH_TOKEN_FEES:
    'Launch token fees are burned, quote fees are still paid out.',
  BUYBACK_AND_BURN:
    'Launch token fees are burned and quote fees buy the launch token back to burn it.',
  DISTRIBUTE_TO_HOLDERS:
    'Launch token fees are burned and quote fees are distributed to the token holders.',
} as const satisfies Record<SushiV2FeeDisposition, string>

export type SushiV2FeeDestination =
  | 'SUSHI'
  | 'FEE_RECEIVER'
  | 'BURN'
  | 'BUYBACK'
  | 'HOLDERS'

/** Where each side of the collected fees ends up under a given disposition. */
export function getSushiV2FeeRoutes(disposition: SushiV2FeeDisposition): {
  launchToken: readonly SushiV2FeeDestination[]
  quote: readonly SushiV2FeeDestination[]
} {
  switch (disposition) {
    case 'DIRECT_PAYOUT': {
      return {
        launchToken: ['SUSHI', 'FEE_RECEIVER'],
        quote: ['SUSHI', 'FEE_RECEIVER'],
      }
    }
    case 'BURN_LAUNCH_TOKEN_FEES': {
      return {
        launchToken: ['SUSHI', 'BURN'],
        quote: ['SUSHI', 'FEE_RECEIVER'],
      }
    }
    case 'BUYBACK_AND_BURN': {
      return {
        launchToken: ['SUSHI', 'BURN'],
        quote: ['SUSHI', 'BUYBACK'],
      }
    }
    case 'DISTRIBUTE_TO_HOLDERS': {
      return {
        launchToken: ['SUSHI', 'BURN'],
        quote: ['SUSHI', 'HOLDERS'],
      }
    }
  }
}

const SUSHI_V2_FEE_TRANSITIONS = {
  DIRECT_PAYOUT: [
    'BURN_LAUNCH_TOKEN_FEES',
    'BUYBACK_AND_BURN',
    'DISTRIBUTE_TO_HOLDERS',
  ],
  BURN_LAUNCH_TOKEN_FEES: ['BUYBACK_AND_BURN', 'DISTRIBUTE_TO_HOLDERS'],
  BUYBACK_AND_BURN: [],
  DISTRIBUTE_TO_HOLDERS: [],
} as const satisfies Record<
  SushiV2FeeDisposition,
  readonly SushiV2FeeDisposition[]
>

export function getSushiV2FeeDispositionTransitions(
  current: SushiV2FeeDisposition,
  tokenSupportsHolderRewards: boolean,
): readonly SushiV2FeeDisposition[] {
  const transitions = SUSHI_V2_FEE_TRANSITIONS[current]
  if (tokenSupportsHolderRewards) return transitions

  // Tokens deployed before V2.2 lack the transfer hooks required for holder rewards.
  return transitions.filter((next) => next !== 'DISTRIBUTE_TO_HOLDERS')
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
