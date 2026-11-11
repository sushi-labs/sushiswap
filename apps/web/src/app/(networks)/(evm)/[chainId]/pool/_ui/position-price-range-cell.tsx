'use client'

import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react-v1/solid'
import { FormattedNumber, SkeletonText, classNames } from '@sushiswap/ui'
import type { ReactElement } from 'react'

interface PositionPriceRangeCellProps {
  lower: string | undefined
  upper: string | undefined
  currentPrice: string | undefined
  quoteSymbol: string
  baseSymbol: string
  status: 'closed' | 'in-range' | 'out-of-range'
  onInvert: () => void
}

export function PositionPriceRangeCell({
  lower,
  upper,
  currentPrice,
  quoteSymbol,
  baseSymbol,
  status,
  onInvert,
}: PositionPriceRangeCellProps): ReactElement {
  return (
    <button
      type="button"
      className="flex flex-col gap-1 text-left"
      aria-label="Invert price range"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onInvert()
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            status === 'closed'
              ? 'bg-slate-700'
              : status === 'in-range'
                ? 'bg-green'
                : 'bg-red',
            'w-2 h-2 rounded-full',
          )}
        />
        <span className="whitespace-nowrap text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          <FormattedNumber number={lower} maxDecimalPlaces={3} /> {quoteSymbol}
          <span className="flex items-center">
            <ArrowSmLeftIcon
              width={16}
              height={16}
              className="text-gray-500 dark:text-slate-500"
            />
            <ArrowSmRightIcon
              width={16}
              height={16}
              className="text-gray-500 dark:text-slate-500 ml-[-7px]"
            />
          </span>
          <FormattedNumber number={upper} maxDecimalPlaces={3} /> {quoteSymbol}
        </span>
      </div>
      <span className="text-xs flex items-center gap-1 text-gray-900 dark:text-slate-500">
        Current:{' '}
        {currentPrice !== undefined ? (
          <FormattedNumber number={currentPrice} maxDecimalPlaces={3} />
        ) : (
          <SkeletonText fontSize="xs" className="w-12" />
        )}{' '}
        {quoteSymbol} per {baseSymbol}
      </span>
    </button>
  )
}
