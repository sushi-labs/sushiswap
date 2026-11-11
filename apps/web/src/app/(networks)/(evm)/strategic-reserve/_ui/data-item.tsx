import { SkeletonBox } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const DataItem = ({
  label,
  value,
  subLabel,
  isLoading,
  isError,
}: {
  label: string
  value: ReactNode
  subLabel: ReactNode
  isLoading: boolean
  isError: boolean
}) => {
  return (
    <div className="w-full flex h-full flex-col gap-2">
      <span className="text-sm !font-normal text-muted-foreground">
        {label}
      </span>

      {isLoading ? (
        <SkeletonBox className="h-9 w-1/2" />
      ) : isError ? (
        <span className="text-sm text-red h-9">Error</span>
      ) : (
        <span className="text-3xl font-medium">{value}</span>
      )}
      {isLoading ? (
        <SkeletonBox className="h-4 w-1/4" />
      ) : (
        <span className="text-xs text-muted-foreground">{subLabel}</span>
      )}
    </div>
  )
}
