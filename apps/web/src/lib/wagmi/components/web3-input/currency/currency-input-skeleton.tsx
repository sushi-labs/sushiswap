import { SkeletonBox, SkeletonText, classNames } from '@sushiswap/ui'

interface CurrencyInputSkeletonProps {
  label?: string
  className?: string
}

function CurrencyInputSkeleton({
  label,
  className,
}: CurrencyInputSkeletonProps) {
  return (
    <div
      className={classNames(
        'relative space-y-2 overflow-hidden pb-2',
        className,
      )}
    >
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
      <div className="relative flex items-center gap-4">
        <div className="flex gap-4 items-center justify-between flex-grow h-[44px]">
          <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
          <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between h-[36px]">
        <div className="w-1/5 flex items-center">
          <SkeletonText fontSize="lg" className="w-full" />
        </div>
        <div className="w-[60px] flex items-center">
          <SkeletonText fontSize="lg" className="w-full" />
        </div>
      </div>
    </div>
  )
}

export { CurrencyInputSkeleton, type CurrencyInputSkeletonProps }
