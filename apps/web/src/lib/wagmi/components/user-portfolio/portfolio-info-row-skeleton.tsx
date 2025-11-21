import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'

export const PortfolioInfoRowSkeleton = ({ amount }: { amount: number }) => {
  return (
    <div>
      {Array.from({ length: amount }).map((_, i) => (
        <div
          key={`${i}`}
          className="flex w-full items-center px-5 py-3 gap-x-5"
        >
          <SkeletonCircle radius={28} />
          <div className="flex w-full justify-between items-center gap-x-3">
            <div className="basis-3/4 flex flex-col gap-y-1">
              <SkeletonText fontSize="sm" />
              <SkeletonText fontSize="xs" />
            </div>
            <div className="basis-1/4 flex flex-col gap-y-1">
              <SkeletonText fontSize="sm" />
              <SkeletonText fontSize="xs" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
