import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Transition } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import React from 'react'
import { formatNumber } from 'utils/utilFunctions'
import { TradeRoute } from './TradeRoute'

export const TradeStats = () => {
  const { token1, amount, bestRoutes, isLoadingPrice, isPriceFetching, outputAmount, slippageAmount } = useSwapState()
  const { account, network } = useWallet()
  const loading = Boolean(isLoadingPrice && Number(amount) > 0) || isPriceFetching
  const outputSwapTokenAmount = outputAmount
    ? String(formatNumber(parseFloat(outputAmount), token1 ? token1.decimals : 8))
    : ''

  const minOutput = slippageAmount ? formatNumber(slippageAmount, token1 ? token1.decimals : 8) : 0

  return (
    <Transition
      show={Number(amount) > 0 && bestRoutes.length > 0}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="w-full px-2 flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Price impact</span>
          <span className={classNames('text-sm font-semibold text-gray-700 text-right dark:text-slate-400')}>
            {loading ? <Skeleton.Box className="h-4 py-0.5 w-[120px] rounded-md" /> : <>null</>}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Est. received</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !outputSwapTokenAmount ? (
              <Skeleton.Text fontSize="text-sm" className="w-[120px]" />
            ) : (
              `${outputSwapTokenAmount} ${token1.symbol}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Min. received</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading || !minOutput ? (
              <Skeleton.Text fontSize="text-sm" className="w-[120px]" />
            ) : (
              `${minOutput} ${token1.symbol}`
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Route</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? (
              <Skeleton.Text fontSize="text-sm" className="w-[120px]" />
            ) : (
              <Modal.Trigger tag={`trade-state-routes`}>
                {({ open }) => (
                  <button onClick={open} className="text-sm text-blue font-semibold">
                    View
                  </button>
                )}
              </Modal.Trigger>
            )}
            <TradeRoute trade={bestRoutes} />
          </span>
        </div>
        {account?.address && (
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-200/5 mt-2 pt-2">
            <span className="font-medium text-sm text-gray-700 dark:text-slate-300">Recipient</span>
            <span className="font-semibold text-gray-700 text-right dark:text-slate-400">
              <a
                target="_blank"
                href={`https://explorer.aptoslabs.com/account/${account?.address}?network=testnet`}
                className={classNames('transition-all flex gap-1 items-center')}
                rel="noreferrer"
              >
                {`${account?.address.substring(0, 6)}...${account?.address.substring(66 - 4)}`}
              </a>
            </span>
          </div>
        )}
      </div>
    </Transition>
  )
}
