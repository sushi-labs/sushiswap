import { SkeletonText } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import { formatUSD } from 'sushi'

export function ReviewAmountValue({
  children,
  usdValue,
  isUsdLoading = false,
}: {
  children: ReactNode
  usdValue?: string | number | null
  isUsdLoading?: boolean
}): ReactElement {
  const value =
    usdValue === undefined ||
    usdValue === null ||
    (typeof usdValue === 'string' && usdValue.trim() === '')
      ? undefined
      : Number(usdValue)

  return (
    <div className="flex flex-col items-end gap-0.5">
      <div>{children}</div>
      {isUsdLoading ? (
        <SkeletonText align="right" fontSize="xs" className="!w-16" />
      ) : value !== undefined && Number.isFinite(value) && value >= 0 ? (
        <span className="text-xs text-muted-foreground">
          {formatUSD(value)}
        </span>
      ) : null}
    </div>
  )
}
