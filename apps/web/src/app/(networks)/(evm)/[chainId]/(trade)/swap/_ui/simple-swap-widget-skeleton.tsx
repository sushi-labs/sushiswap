import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import { SkeletonBox, SkeletonText } from '@sushiswap/ui'

function SimpleSwapInputSkeleton({ label }: { label: string }) {
  return (
    <div className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl relative space-y-2 overflow-hidden pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex gap-4 items-center justify-between h-[44px]">
        <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
        <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
      </div>
      <div className="flex items-center justify-between h-[36px]">
        <SkeletonText fontSize="lg" className="!w-1/5" />
        <SkeletonText fontSize="lg" className="!w-[60px]" />
      </div>
    </div>
  )
}

function SimpleSwapWidgetSkeleton() {
  return (
    <>
      <SimpleSwapInputSkeleton label="Sell" />
      <div className="left-0 right-0 mt-[-26px] mb-[-26px] flex items-center justify-center">
        <button
          type="button"
          disabled
          aria-label="Switch tokens"
          className="z-10 bg-background p-2 border border-accent rounded-full"
        >
          <ArrowsUpDownIcon strokeWidth={3} className="w-3 h-3 text-blue" />
        </button>
      </div>
      <SimpleSwapInputSkeleton label="Buy" />
      <SkeletonBox className="w-full h-[52px] rounded-xl mb-2" />
    </>
  )
}

export { SimpleSwapWidgetSkeleton }
