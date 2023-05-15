import { classNames, NetworkIcon } from '@sushiswap/ui'
import { ChainId } from '@sushiswap/chain'
import { Currency } from '@sushiswap/ui/future/components/currency'
import React, { FC, Fragment, useState } from 'react'
import { PositionWithPool } from '../../types'
import { useTokensFromPool } from '../../lib/hooks'
import { formatNumber, formatUSD } from '@sushiswap/format'
import { Transition } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'

interface PositionCard {
  position: PositionWithPool
}

export const PositionCard: FC<PositionCard> = ({ position }) => {
  const [open, setOpen] = useState(false)
  const { token0, token1 } = useTokensFromPool(position.pool)
  const valueUSD = (Number(position.balance) / Number(position.pool.totalSupply)) * Number(position.pool.liquidityUSD)

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative bg-white dark:bg-slate-800 hover:shadow-md transition-all rounded-2xl px-5 py-10 overflow-hidden"
    >
      <div className="absolute top-2 left-2">
        <NetworkIcon chainId={position.chainId as ChainId} width={24} height={24} />
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="flex min-w-[44px]">
          <Currency.IconList iconWidth={48} iconHeight={48}>
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
        </div>
        <h1 className="font-semibold mt-6">
          {token0.symbol}/{token1.symbol}
        </h1>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-1">
            <div className="py-0.5 bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
              {formatNumber(position.pool.swapFee * 100)}%
            </div>
            {position.pool.incentives && position.pool.incentives.length > 0 && (
              <Tooltip description="Farm rewards available">
                <div className="py-0.5 bg-green/20 text-green text-[10px] px-2 rounded-full">
                  🧑‍🌾 {position.pool.incentives.length > 1 ? `x ${position.pool.incentives.length}` : ''}{' '}
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        <span className="text-sm font-medium pt-4">{formatUSD(valueUSD)}</span>
      </div>
      <Transition show={open}>
        <Transition.Child
          as={Fragment}
          enter="transition duration-300 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-300 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 paper z-[100]" />
        </Transition.Child>
        <div className="absolute inset-0 z-[101]">
          <div className="flex items-center justify-center h-full">
            <Transition.Child
              as={Fragment}
              enter="transition duration-300 ease-out"
              enterFrom="transform translate-y-[-16px] opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-300 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform translate-y-[-16px] opacity-0"
            >
              <Button as="a" href={`/pools/migrate/${position.pool.id}`} className="!rounded-full">
                Migrate
              </Button>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </div>
  )
}
