import { Card, SkeletonBox, SkeletonText } from '@sushiswap/ui'

export const TierSkeleton = () => {
  return (
    <Card>
      <div className="px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <SkeletonText className="!max-w-[156px]" />
          <div className="flex items-center gap-6">
            <SkeletonBox className="min-w-[48px] w-[48px] h-12 rounded-xl" />
            <div className="flex flex-col w-full">
              <SkeletonText className="!max-w-[80px]" />
              <SkeletonText className="!max-w-[300px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-2 w-full">
          <div className="flex justify-between items-end w-full">
            <SkeletonBox className="h-6 w-[80px]" />
            <SkeletonBox className="h-4 w-[80px]" />
          </div>
          <SkeletonBox className="w-full rounded-full h-3" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[...Array(8)].map((_, i) => (
            <SkeletonBox key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </Card>
  )
}
