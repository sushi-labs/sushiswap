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
