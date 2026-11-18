import { SkeletonBox, classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const DataItem = ({
  label,
  value,
  subLabel,
  isLoading,
  isError,
}: {
  label: ReactNode
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

      <div className="relative text-3xl font-medium">
        <div
          className={classNames((isLoading || isError) && 'invisible')}
          aria-hidden={isLoading || isError}
        >
          {value}
        </div>
        {isLoading ? (
          <SkeletonBox className="absolute inset-y-0 left-0 w-1/2" />
        ) : isError ? (
          <span className="absolute inset-0 flex items-center text-sm text-red">
            Error
          </span>
        ) : null}
      </div>
      {subLabel !== undefined && subLabel !== null ? (
        <div className="min-h-4 text-xs text-muted-foreground">
          {isLoading ? <SkeletonBox className="h-4 w-1/4" /> : subLabel}
        </div>
      ) : null}
    </div>
  )
}
