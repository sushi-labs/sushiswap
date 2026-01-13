import { SkeletonBox } from '@sushiswap/ui'

export const AssetStatsSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <SkeletonBox className="w-12 h-5" />
      <SkeletonBox className="w-14 h-5" />
    </div>
  )
}
