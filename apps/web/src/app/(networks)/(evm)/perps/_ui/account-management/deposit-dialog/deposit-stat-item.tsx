import { SkeletonBox } from '@sushiswap/ui'
import type { ReactElement } from 'react'

export function DepositStatItem({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string
  isLoading: boolean
}): ReactElement {
  return (
    <div className="flex justify-between items-center gap-2 text-xs">
      <span className="text-perps-muted-50">{label}</span>
      <span className="font-semibold text-perps-muted text-right">
        {isLoading ? <SkeletonBox className="h-4 py-0.5 w-[100px]" /> : value}
      </span>
    </div>
  )
}
