import { Disclosure, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Percent } from '@sushiswap/math'
import { classNames, Tooltip, Typography } from '@sushiswap/ui'
import { Rate, useTrade } from 'components'
import React, { FC, useMemo } from 'react'

import { warningSeverity } from '../../lib/functions'
import { useSettings } from '../../lib/state/storage'

export const SwapStatsDisclosure: FC = () => {
  const { trade } = useTrade()
  const [{ slippageTolerance }] = useSettings()
  const priceImpactSeverity = useMemo(() => warningSeverity(trade?.priceImpact), [trade?.priceImpact])

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const stats = (
    <>
      <Typography variant="sm" className="text-slate-400">
        Price Impact
      </Typography>
      <Typography
        variant="sm"
        weight={500}
        className={classNames(
          priceImpactSeverity === 2 ? 'text-yellow' : priceImpactSeverity > 2 ? 'text-red' : 'text-slate-200',
          'text-right truncate'
        )}
      >
        {trade?.priceImpact?.multiply(-1).toFixed(2)}%
      </Typography>
      <div className="col-span-2 border-t border-slate-200/5 w-full py-0.5" />
      <Typography variant="sm" className="text-slate-400">
        Min. Received
      </Typography>
      <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
        {trade?.minimumAmountOut(slippagePercent)?.toSignificant(6)}{' '}
        {trade?.minimumAmountOut(slippagePercent)?.currency.symbol}
      </Typography>
    </>
  )

  return (
    <Transition
      show={!!trade}
      unmount={false}
      className="p-3 !pb-1 transition-[max-height] overflow-hidden"
      enter="duration-300 ease-in-out"
      enterFrom="transform max-h-0"
      enterTo="transform max-h-[380px]"
      leave="transition-[max-height] duration-250 ease-in-out"
      leaveFrom="transform max-h-[380px]"
      leaveTo="transform max-h-0"
    >
      <Disclosure>
        {({ open }) => (
          <>
            <div className="flex justify-between items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2.5 gap-2">
              <Rate price={trade?.executionPrice}>
                {({ content, usdPrice, toggleInvert }) => (
                  <div
                    className="text-sm text-slate-300 hover:text-slate-50 cursor-pointer flex items-center h-full gap-1 font-semibold tracking-tight h-[36px] flex items-center truncate"
                    onClick={toggleInvert}
                  >
                    <Tooltip
                      panel={<div className="grid grid-cols-2 gap-1">{stats}</div>}
                      button={<InformationCircleIcon width={16} height={16} />}
                    />{' '}
                    {content} {usdPrice && <span className="font-medium text-slate-500">(${usdPrice})</span>}
                  </div>
                )}
              </Rate>
              <Disclosure.Button className="flex items-center justify-end flex-grow cursor-pointer">
                <ChevronDownIcon
                  width={24}
                  height={24}
                  className={classNames(
                    open ? '!rotate-180' : '',
                    'rotate-0 transition-[transform] duration-300 ease-in-out delay-200'
                  )}
                />
              </Disclosure.Button>
            </div>
            <Transition
              show={open}
              unmount={false}
              className="transition-[max-height] overflow-hidden"
              enter="duration-300 ease-in-out"
              enterFrom="transform max-h-0"
              enterTo="transform max-h-[380px]"
              leave="transition-[max-height] duration-250 ease-in-out"
              leaveFrom="transform max-h-[380px]"
              leaveTo="transform max-h-0"
            >
              <Disclosure.Panel
                as="div"
                className="grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-200/5 rounded-2xl"
              >
                {stats}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </Transition>
  )
}
