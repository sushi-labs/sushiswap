import { SkeletonBox, classNames } from '@sushiswap/ui'
import { SwitchArrowsIcon } from '@sushiswap/ui/icons/switch-arrows-icon'
import type { ReactElement } from 'react'
import { CurrencyInputSkeleton } from 'src/lib/wagmi/components/web3-input/currency/currency-input-skeleton'
import type { ChainId } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import { SwapInputLabel } from '../../_ui/swap-input-label'

function SimpleSwapWidgetSkeleton({
  chainId,
}: { chainId?: ChainId }): ReactElement {
  return (
    <>
      <CurrencyInputSkeleton
        label={
          chainId ? (
            <SwapInputLabel chainId={chainId} type="INPUT" />
          ) : (
            <span className="flex text-xs text-primary">From:</span>
          )
        }
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
      <div className="flex flex-col">
        <CurrencyInputSkeleton
          label={
            chainId ? (
              <SwapInputLabel chainId={chainId} type="OUTPUT" />
            ) : (
              <span className="flex text-xs text-primary">To:</span>
            )
          }
          className="border border-accent p-4 bg-muted rounded-2xl"
        />
        <SkeletonBox
          className={classNames(
            'w-full h-[52px] !rounded-full',
            chainId === StellarChainId.STELLAR ? 'mt-4' : 'mb-2',
          )}
        />
      </div>
    </>
  )
}

export { SimpleSwapWidgetSkeleton }
