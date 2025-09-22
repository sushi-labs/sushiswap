import { Transition } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import { SkeletonBox } from '@sushiswap/ui'
import Link from 'next/link'
import { useMemo } from 'react'
import { formatPercent, formatUSD, truncateString } from 'sushi'
import { getKvmChainByKey } from 'sushi/kvm'
import { GAS_PRICE } from '~kadena/_common/constants/gas'
import { KADENA } from '~kadena/_common/constants/token-list'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~kadena/_common/lib/utils/warning-severity'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapState } from '~kadena/swap/swap-provider'
import { SwapRoutesDialog } from './SwapRoutesDialog'

export const SwapStats = () => {
  const {
    token1,
    amountOut,
    minAmountOut,
    gas,
    amountIn,
    priceImpactPercentage,
    route,
  } = useSwapState()
  const { activeAccount } = useKadena()
  const address = activeAccount?.accountName ?? ''

  const { data, isLoading: isPriceLoading } = useTokenPrice({
    token: KADENA,
  })
  const KDAPrice = data ?? 0

  const isLoading =
    priceImpactPercentage === undefined ||
    priceImpactPercentage === 0 ||
    !amountOut ||
    isPriceLoading

  const severityColor = useMemo(() => {
    return warningSeverityClassName(warningSeverity(priceImpactPercentage))
  }, [priceImpactPercentage])

  const networkFee = useMemo(() => {
    const networkFeeInKDA = gas
    const feeInUsd = networkFeeInKDA * KDAPrice * GAS_PRICE
    const feeInToken = networkFeeInKDA * GAS_PRICE
    return { feeInUsd, feeInToken }
  }, [KDAPrice, gas])

  return (
    <Transition
      show={
        amountIn !== undefined &&
        amountOut !== undefined &&
        route &&
        route.length > 0
      }
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
              `${amountOut.toSignificant(6)} ${token1?.symbol}`
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
              `${minAmountOut.toSignificant(6)} ${token1?.symbol}`
            )}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">
            Network fee
          </span>
          <span className="text-sm font-semibold text-right text-gray-700 dark:text-slate-400">
            {isLoading || networkFee.feeInToken === undefined ? (
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
                href={getKvmChainByKey('kadena').getAccountUrl(address)}
                className={classNames(
                  'flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300',
                )}
                rel="noreferrer"
              >
                {truncateString(address, 10, 'middle')}
              </Link>
            </span>
          </div>
        )}
      </div>
    </Transition>
  )
}
