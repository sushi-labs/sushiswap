import { Transition } from '@headlessui/react'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { SkeletonBox } from '@sushiswap/ui'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { formatPercent, formatUSD } from 'sushi/format'
import { toBigNumber, truncateText } from '~kadena/_common/lib/utils/formatters'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~kadena/_common/lib/utils/warning-severity'
import { useSwapState } from '~kadena/swap/swap-provider'
import { SwapRoutesDialog } from './SwapRoutesDialog'

export const SwapStats = () => {
  const { token0, token1, amountOut, amountIn, priceImpactPercentage, route } =
    useSwapState()
  const address =
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'
  const [isPriceLoading, setisPriceLoading] = useState(true)
  const KDAPrice = '0.123'

  useEffect(() => {
    setTimeout(() => {
      setisPriceLoading(false)
      setIsNetworkFeeLoading(false)
    }, 1000)
  }, [])

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const swapType = 'swap'

  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const minOutput = useMemo(() => {
    if (!amountOut) return ''
    if (
      (token0?.tokenSymbol === 'WKDA' && token1?.tokenSymbol === 'KDA') ||
      (token0?.tokenSymbol === 'KDA' && token1?.tokenSymbol === 'WKDA')
    ) {
      return amountIn
    }

    const output = Number(amountOut) * (1 - slippage)
    return output
  }, [amountOut, slippage, token0, token1, amountIn])

  const [isNetworkFeeLoading, setIsNetworkFeeLoading] = useState(true)
  const networkFeeInKDA = '0.24'

  const isLoading =
    priceImpactPercentage === undefined ||
    (priceImpactPercentage === 0 && swapType === 'swap') ||
    amountOut === '' ||
    amountOut === '' ||
    isPriceLoading ||
    isNetworkFeeLoading

  const severityColor = useMemo(() => {
    return warningSeverityClassName(warningSeverity(priceImpactPercentage))
  }, [priceImpactPercentage])

  const networkFee = useMemo(() => {
    const fee = toBigNumber(networkFeeInKDA ?? '0')
    const feeInUsd = fee.multipliedBy(KDAPrice).toString()
    return { feeInUsd, feeInToken: networkFeeInKDA }
  }, [])

  return (
    <Transition
      show={amountIn !== '' && amountOut !== '' && route && route.length > 0}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="flex flex-col w-full gap-1 px-2 pb-8">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Price impact
          </span>
          <span
            className={classNames(
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400',
            )}
          >
            {isLoading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              <span style={{ color: severityColor }}>
                {priceImpactPercentage
                  ? `-${formatPercent(priceImpactPercentage / 100)}`
                  : formatPercent(0)}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Est. received
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {isLoading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              `${amountOut} ${token1?.tokenSymbol}`
            )}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Min. received
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {isLoading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              `${minOutput} ${token1?.tokenSymbol}`
            )}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {isLoading || !networkFee.feeInToken ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              <>
                {networkFee.feeInToken} KDA (~
                {formatUSD(networkFee?.feeInUsd)})
              </>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Route
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {isLoading ? (
              <SkeletonBox className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              <SwapRoutesDialog>
                <button
                  type="button"
                  className="text-sm font-semibold text-blue"
                >
                  View
                </button>
              </SwapRoutesDialog>
            )}
          </span>
        </div>
        {address && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200 dark:border-slate-200/5">
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Recipient
            </span>
            <span className="font-semibold text-right ">
              <Link
                target="_blank"
                href={getChainwebAddressLink(address)}
                className={classNames(
                  'flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300',
                )}
                rel="noreferrer"
              >
                {truncateText(address)}
              </Link>
            </span>
          </div>
        )}
      </div>
    </Transition>
  )
}
