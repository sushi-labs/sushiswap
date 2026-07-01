export function getMarginRequiredFromLeverage({
  leverage,
  positionValue,
}: {
  leverage: number
  positionValue: string | undefined
}): string {
  const value = Number(positionValue ?? 0)

  if (!Number.isFinite(value) || leverage <= 0) return '0'

  return (value / leverage).toString()
}

export function maxRemovableIsolatedMargin({
  canRemove = true,
  marginRequired,
  marginUsed,
  positionValue,
  decimals = 6,
}: {
  canRemove?: boolean
  marginRequired: string
  marginUsed: string
  positionValue: string
  decimals?: number
}): string {
  if (!canRemove) return '0'

  const initial = Number(marginRequired)
  const m = Number(marginUsed)
  const total = Number(positionValue)

  if (
    !Number.isFinite(initial) ||
    !Number.isFinite(m) ||
    !Number.isFinite(total)
  )
    return '0'

  const minKeep = Math.max(initial, 0.1 * total)
  const raw = Math.max(0, m - minKeep)
  const factor = 10 ** decimals

  return (Math.floor(raw * factor) / factor).toString()
}
