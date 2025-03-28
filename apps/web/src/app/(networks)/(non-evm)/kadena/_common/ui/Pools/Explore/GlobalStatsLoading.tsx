import { SkeletonChart, SkeletonText } from '@sushiswap/ui'

export const GlobalStatsLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-10">
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">KADENA TVL</span>
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <SkeletonChart type="area" height={400} />
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">KADENA Volume</span>
          <SkeletonText fontSize="3xl" className="!w-36" />
          <SkeletonText fontSize="sm" className="!w-40" />
        </div>
        <SkeletonChart type="bar" height={400} />
      </div>
    </div>
  )
}
