import { Transition } from '@headlessui/react'
import { SkeletonBox, classNames } from '@sushiswap/ui'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~stellar/_common/lib/utils/warning-severity'
import { useSimpleSwapState } from './simple-swap-provider/simple-swap-provider'

export const SimpleSwapTradeStats = () => {
  const {
    token1,
    amount,
    isLoadingPrice,
    isPriceFetching,
    outputAmount,
    slippageAmount,
    priceImpact,
  } = useSimpleSwapState()

  const loading =
    Boolean(isLoadingPrice && Number(amount) > 0) || isPriceFetching

  const outputSwapTokenAmount = outputAmount
    ? (Number(outputAmount) / 10 ** token1.decimals).toFixed(6)
    : null

  return (
    <Transition
      show={Number(amount) > 0}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              warningSeverityClassName(
                warningSeverity(priceImpact || undefined),
              ),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {loading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              <>
                {priceImpact !== null
                  ? `${priceImpact > 0 ? '-' : '+'}${Math.abs(priceImpact).toFixed(2)}`
                  : '0.00'}
                %
              </>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !outputSwapTokenAmount ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              `${outputSwapTokenAmount} ${token1.code}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received after slippage
          </span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : slippageAmount !== null && slippageAmount > 0 ? (
              `${(slippageAmount / 10 ** token1.decimals).toFixed(6)} ${token1.code}`
            ) : (
              '0.00'
            )}
          </span>
        </div>
      </div>
    </Transition>
  )
}
