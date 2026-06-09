import { SkeletonBox } from '@sushiswap/ui'

export const AssetStatsSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <SkeletonBox className="w-12 h-4" />
      <SkeletonBox className="w-14 h-4" />
    </div>
  )
}
