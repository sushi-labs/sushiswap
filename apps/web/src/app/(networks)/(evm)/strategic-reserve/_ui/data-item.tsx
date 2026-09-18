import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'

export const DataItem = ({
  label,
  value,
  subLabel,
  isLoading,
  isError,
  className,
}: {
  label: string
  value: ReactNode
  subLabel: ReactNode
  isLoading: boolean
  isError: boolean
  className?: string
}) => {
  return (
    <Card className={classNames('w-full', className)}>
      <CardHeader className="!pb-1 !p-4 md:!px-6">
        <CardTitle className="flex gap-1 items-center">
          <span className="text-sm text-muted-foreground">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="!gap-2 px-4 md:px-6">
        {isLoading ? (
          <SkeletonBox className="h-9 w-full" />
        ) : isError ? (
          <span className="text-sm text-red h-9">Error</span>
        ) : (
          <span className="text-3xl font-bold">{value}</span>
        )}
        {subLabel && (
          <span className="text-xs text-muted-foreground">{subLabel}</span>
        )}
      </CardContent>
    </Card>
  )
}
