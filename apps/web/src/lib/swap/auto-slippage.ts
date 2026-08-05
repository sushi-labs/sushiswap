export const AUTO_SLIPPAGE_MIN_BASIS_POINTS = 50
export const AUTO_SLIPPAGE_MAX_BASIS_POINTS = 550

interface AutoSlippageToleranceBasisPointsParams {
  gasCostUsd: number | string | undefined
  tradeValueUsd: number | string | undefined
}

/**
 * Sizes the slippage window so its USD value roughly matches the cost of
 * retrying a failed transaction, then applies the frontend safety bounds.
 */
export function getAutoSlippageToleranceBasisPoints({
  gasCostUsd,
  tradeValueUsd,
}: AutoSlippageToleranceBasisPointsParams): number {
  const gasCost = Number(gasCostUsd)
  const tradeValue = Number(tradeValueUsd)

  if (
    !Number.isFinite(gasCost) ||
    gasCost <= 0 ||
    !Number.isFinite(tradeValue) ||
    tradeValue <= 0
  ) {
    return AUTO_SLIPPAGE_MIN_BASIS_POINTS
  }

  const economicSlippageBasisPoints = Math.ceil((gasCost / tradeValue) * 10_000)

  return Math.min(
    AUTO_SLIPPAGE_MAX_BASIS_POINTS,
    Math.max(AUTO_SLIPPAGE_MIN_BASIS_POINTS, economicSlippageBasisPoints),
  )
}
