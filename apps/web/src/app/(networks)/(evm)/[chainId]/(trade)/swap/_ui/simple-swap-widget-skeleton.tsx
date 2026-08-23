import ArrowsUpDownIcon from '@heroicons/react/24/solid/ArrowsUpDownIcon'
import { SkeletonBox } from '@sushiswap/ui'
import { CurrencyInputSkeleton } from 'src/lib/wagmi/components/web3-input/currency/currency-input-skeleton'

function SimpleSwapWidgetSkeleton() {
  return (
    <>
      <CurrencyInputSkeleton
        label="Sell"
        className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      />
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
      <CurrencyInputSkeleton
        label="Buy"
        className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
      />
      <SkeletonBox className="w-full h-[52px] rounded-xl mb-2" />
    </>
  )
}

export { SimpleSwapWidgetSkeleton }
