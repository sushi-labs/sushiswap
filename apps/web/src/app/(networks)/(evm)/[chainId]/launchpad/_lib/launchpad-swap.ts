import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { withoutScientificNotation } from 'sushi'

export const LAUNCHPAD_SWAP_FEE = 0.01

export const LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS = {
  storageKey: SlippageToleranceStorageKey.LaunchpadTokenSwap,
  defaultValue: '10',
} as const

export const QUICK_BUY_USD_AMOUNTS = [1, 25, 50, 100] as const

export function getQuickBuyNativeAmount(
  usdAmount: number,
  nativePrice: number | undefined,
  nativeDecimals: number,
): string | undefined {
  if (
    !Number.isFinite(usdAmount) ||
    usdAmount <= 0 ||
    !nativePrice ||
    !Number.isFinite(nativePrice) ||
    nativePrice <= 0
  ) {
    return undefined
  }

  const value = withoutScientificNotation(String(usdAmount / nativePrice))
  if (!value) return undefined

  const [whole, fraction = ''] = value.split('.')
  const trimmedFraction = fraction.slice(0, nativeDecimals).replace(/0+$/, '')

  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole
}
