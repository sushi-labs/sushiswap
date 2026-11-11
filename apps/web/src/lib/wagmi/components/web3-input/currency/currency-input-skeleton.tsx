import { SkeletonBox, SkeletonText, classNames } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import { PricePanel } from './price-panel'

interface CurrencyInputSkeletonProps {
  label?: ReactNode
  className?: string
}

function CurrencyInputSkeleton({
  label,
  className,
}: CurrencyInputSkeletonProps): ReactElement {
  return (
    <div className={classNames('relative overflow-hidden', className)}>
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative flex items-center gap-4 py-1">
        <SkeletonBox className="w-32 h-11 shrink-0 !rounded-full" />
        <div className="flex flex-col flex-1 min-w-0 items-end">
          <div className="flex w-full h-10 items-center justify-end">
            <SkeletonBox className="w-2/3 max-w-32 h-8 rounded-lg" />
          </div>
          <PricePanel
            loading={false}
            price={undefined}
            currency={undefined}
            value=""
          />
        </div>
      </div>
      <div className="w-24 h-6 flex items-center">
        <SkeletonText fontSize="xs" className="w-full" />
      </div>
    </div>
  )
}

export { CurrencyInputSkeleton, type CurrencyInputSkeletonProps }
