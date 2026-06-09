import { SkeletonBox } from '@sushiswap/ui'

export const AccountManagementSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <SkeletonBox className="w-full h-10 rounded-xl" />
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-full h-9 rounded-xl" />
          <SkeletonBox className="w-full h-9 rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <hr className="my-0.5 border-t border-accent hidden lg:block" />
        <SkeletonBox className="w-20 h-4 rounded-sm mb-2 lg:mb-1" />
        {Array.from({ length: 2 }).map((_, i) => (
          <_SkeletonItem key={i} />
        ))}
        <hr className="border-t border-accent block lg:hidden" />
        <SkeletonBox className="w-20 h-4 rounded-sm mb-2 lg:mb-1" />
        {Array.from({ length: 5 }).map((_, i) => (
          <_SkeletonItem key={i} />
        ))}
      </div>
    </>
  )
}

const _SkeletonItem = () => {
  return (
    <div className="flex items-center justify-between">
      <SkeletonBox className="w-20 h-3 rounded-sm" />
      <SkeletonBox className="w-16 h-3 rounded-sm" />
    </div>
  )
}
