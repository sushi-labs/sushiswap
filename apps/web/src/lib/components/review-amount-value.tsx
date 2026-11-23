import { SkeletonText } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import { formatUSD } from 'sushi'

export function ReviewAmountValue({
  children,
  usdValue,
  secondaryValue,
  isUsdLoading = false,
}: {
  children: ReactNode
  usdValue?: string | number | null
  secondaryValue?: string
  isUsdLoading?: boolean
}): ReactElement {
  const value =
    usdValue === undefined ||
    usdValue === null ||
    (typeof usdValue === 'string' && usdValue.trim() === '')
      ? undefined
      : Number(usdValue)
  const secondary =
    secondaryValue ??
    (value !== undefined && Number.isFinite(value) && value >= 0
      ? formatUSD(value)
      : undefined)

  return (
    <div className="flex flex-col items-end gap-0.5">
      <div>{children}</div>
      {isUsdLoading ? (
        <SkeletonText align="right" fontSize="xs" className="!w-16" />
      ) : secondary !== undefined ? (
        <span className="text-xs text-muted-foreground">{secondary}</span>
      ) : null}
    </div>
  )
}
