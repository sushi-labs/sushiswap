import { Disclosure, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Percent } from '@sushiswap/math'
import { classNames, Dialog, Tooltip, Typography } from '@sushiswap/ui'
import React, { FC, useMemo, useState } from 'react'

import { Rate } from '../Rate'
import { warningSeverity } from '../../lib/functions'
import { useTrade2 } from '../TradeProvider2'
import numeral from 'numeral'

export const SwapStatsDisclosure: FC = () => {
  const { data: trade } = useTrade2()
  const [showRoute, setShowRoute] = useState(false)
  const priceImpactSeverity = useMemo(
    () => warningSeverity(trade?.priceImpact ? new Percent(Math.floor(trade?.priceImpact * 100), 10_000) : undefined),
    [trade]
  )

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
        {numeral(trade?.priceImpact ?? 0).format('0.00%')}
      </Typography>
      <div className="col-span-2 border-t border-slate-200/5 w-full py-0.5" />
      <Typography variant="sm" className="text-slate-400">
        Min. Received
      </Typography>
      <Typography variant="sm" weight={500} className="text-right truncate text-slate-400">
        {trade?.minAmountOut?.toSignificant(6)} {trade?.minAmountOut?.currency.symbol}
      </Typography>
      <Typography variant="sm" className="text-slate-400">
        Optimized Route
      </Typography>
      <Typography
        onClick={() => setShowRoute((prev) => !prev)}
        variant="sm"
        weight={500}
        className="cursor-pointer text-blue hover:text-blue-400 text-right"
      >
        {showRoute ? 'Hide' : 'Show'}
      </Typography>
      <Dialog open={showRoute} onClose={() => setShowRoute(false)}>
        <Dialog.Content className="!pb-4">
          <Dialog.Header border={false} title="Optimized Route" onClose={() => setShowRoute(false)} />
          <div className="max-h-[400px] overflow-y-auto scroll rounded-xl bg-black/[0.24] p-2 border border-slate-200/10">
            {/*<Route />*/}
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )

  return (
    <>
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
                <Rate price={trade?.swapPrice}>
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
    </>
  )
}
