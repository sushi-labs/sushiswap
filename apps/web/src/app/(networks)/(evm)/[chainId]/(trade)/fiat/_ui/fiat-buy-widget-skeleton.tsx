import { SkeletonBox } from '@sushiswap/ui'
import { CurrencyInputSkeleton } from 'src/lib/wagmi/components/web3-input/currency/currency-input-skeleton'

function FiatBuyWidgetSkeleton() {
  return (
    <>
      <div className="space-y-2">
        <CurrencyInputSkeleton
          label="Pay"
          className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBox key={index} className="h-9 w-full rounded-xl" />
          ))}
        </div>
        <CurrencyInputSkeleton
          label="Receive"
          className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-[52px] w-full rounded-xl" />
        <SkeletonBox className="h-11 w-full rounded-xl" />
      </div>
    </>
  )
}

export { FiatBuyWidgetSkeleton }
