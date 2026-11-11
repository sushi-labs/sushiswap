import { SkeletonBox } from '@sushiswap/ui'
import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import { CurrencyInputSkeleton } from 'src/lib/wagmi/components/web3-input/currency/currency-input-skeleton'

function SimpleSwapWidgetSkeleton() {
  return (
    <>
      <CurrencyInputSkeleton
        label={<span className="flex text-xs text-primary">From:</span>}
        className="border border-accent p-4 bg-muted rounded-2xl"
      />
      <div className="left-0 right-0 mt-[-28px] mb-[-28px] flex items-center justify-center">
        <button
          type="button"
          disabled
          aria-label="Switch tokens"
          className="shadow-md z-10 bg-background dark:bg-muted py-3 px-7 border border-accent rounded-full"
        >
          <SwitchArrowsIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <CurrencyInputSkeleton
        label={<span className="flex text-xs text-primary">To:</span>}
        className="border border-accent p-4 bg-muted rounded-2xl"
      />
      <SkeletonBox className="w-full h-[52px] !rounded-full mb-2" />
    </>
  )
}

export { SimpleSwapWidgetSkeleton }
