import { SkeletonBox, SkeletonText } from '@sushiswap/ui'

export const GlobalStatsLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className="p-6">
        <div className="flex flex-col gap-3">
          <SkeletonText fontSize="sm" className="!w-16" />
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <SkeletonBox className="w-full h-[400px]" />
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-3">
          <SkeletonText fontSize="sm" className="!w-20" />
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <SkeletonBox className="w-full h-[400px]" />
      </div>
    </div>
  )
}
