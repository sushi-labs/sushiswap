import {
  EvmChainId,
  type SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'

const DISABLED_FEE_TIERS: Partial<
  Record<SushiSwapV3ChainId, readonly SushiSwapV3FeeAmount[]>
> = {
  [EvmChainId.ROBINHOOD]: [SushiSwapV3FeeAmount.LOWEST],
  [EvmChainId.ROOTSTOCK]: [SushiSwapV3FeeAmount.LOWEST],
}

export function isFeeTierEnabled(
  chainId: SushiSwapV3ChainId,
  feeAmount: SushiSwapV3FeeAmount,
): boolean {
  return !DISABLED_FEE_TIERS[chainId]?.includes(feeAmount)
}

/** The fee tiers every chain offers, shared by V3 pools and V4 presets. */
export const BASE_FEE_TIERS: readonly {
  value: SushiSwapV3FeeAmount
  subtitle: string
}[] = [
  {
    value: SushiSwapV3FeeAmount.LOWEST,
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: SushiSwapV3FeeAmount.LOW,
    subtitle: 'Best for less volatile pairs.',
  },
  { value: SushiSwapV3FeeAmount.MEDIUM, subtitle: 'Best for most pairs.' },
  { value: SushiSwapV3FeeAmount.HIGH, subtitle: 'Best for volatile pairs.' },
]
