import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'

export const MobileCardSkeleton = () => {
  return (
    <div
      className={classNames(
        'rounded-lg items-center border text-xs flex-row justify-between border-accent bg-secondary p-4 flex gap-2',
      )}
    >
      <div className="grid grid-cols-3 gap-2 w-full">
        {Array(3)
          .fill(null)
          .map((_, index) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-1 col-span-1 max-w-[100px]"
              >
                <SkeletonText className="w-16 h-3" />
                <SkeletonText className="w-24 h-4" />
              </div>
            )
          })}
      </div>

      <SkeletonCircle radius={32} />
    </div>
  )
}
