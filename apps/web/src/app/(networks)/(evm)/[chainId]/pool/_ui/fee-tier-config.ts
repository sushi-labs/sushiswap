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

export function getFeeOptions(
  chainId: SushiSwapV3ChainId,
): { value: SushiSwapV3FeeAmount; subtitle: string }[] {
  return [
    {
      value: SushiSwapV3FeeAmount.LOWEST,
      subtitle: 'Best for very stable pairs.',
    },
    {
      value: SushiSwapV3FeeAmount.LOW,
      subtitle: 'Best for less volatile pairs.',
    },
    {
      value: SushiSwapV3FeeAmount.MEDIUM,
      subtitle: 'Best for most pairs.',
    },
    {
      value: SushiSwapV3FeeAmount.HIGH,
      subtitle: 'Best for volatile pairs.',
    },
    ...(chainId === EvmChainId.KATANA
      ? [
          {
            value: SushiSwapV3FeeAmount.HIGHER,
            subtitle: 'Best for highly volatile pairs.',
          },
          {
            value: SushiSwapV3FeeAmount.HIGHEST,
            subtitle: 'Best for extremely volatile pairs.',
          },
        ]
      : []),
  ].filter((option) => isFeeTierEnabled(chainId, option.value))
}
