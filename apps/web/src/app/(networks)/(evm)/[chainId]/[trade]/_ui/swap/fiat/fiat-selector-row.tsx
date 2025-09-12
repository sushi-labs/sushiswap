import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import type React from 'react'
import { type CSSProperties, type FC, memo, useCallback } from 'react'
import type { FiatCurrency } from './derivedstate-fiat-provider'

export interface FiatSelectorRow {
  currencySymbol: string
  style?: CSSProperties
  className?: string
  onSelect(currency: FiatCurrency): void
  selected: boolean
  flagImage: string
  countryName: string
  countryCode: string
}

export const FiatSelectorRow: FC<FiatSelectorRow> = memo(
  function TokenSelectorRow({
    currencySymbol,
    style,
    className,
    onSelect,
    selected,
    flagImage,
    countryName,
    countryCode,
  }) {
    const onClick = useCallback(() => {
      onSelect({
        symbol: currencySymbol,
        flag: flagImage,
        name: countryName,
        code: countryCode,
      })
    }, [currencySymbol, onSelect, flagImage, countryName, countryCode])

    return (
      <div
        onClick={onClick}
        onKeyDown={onClick}
        className="relative py-0.5 h-[64px]"
        style={style}
      >
        <div
          className={classNames(
            className,
            selected ? 'bg-secondary' : '',
            `group flex items-center w-full hover:bg-blue/10 focus:bg-bg-blue/20 dark:hover:bg-skyblue/10 dark:focus:bg-bg-skyblue/20 h-full rounded-lg px-3`,
          )}
        >
          <div className="flex items-center flex-grow gap-2 rounded cursor-pointer">
            <div className="w-8 h-8">
              <img
                src={flagImage}
                alt={`${currencySymbol} flag`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-900 dark:text-pink-100">
                {currencySymbol}
              </span>
              <span className="text-xs text-muted-foreground dark:text-pink-200">
                {countryName}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export function FiatSelectorRowLoading() {
  return (
    <div className="block flex-1 py-0.5 h-[64px]">
      <div className="flex items-center w-full h-full px-3 rounded-lg">
        <div className="flex items-center justify-between flex-grow gap-2 rounded">
          <div className="flex flex-row items-center flex-grow gap-4">
            <SkeletonCircle radius={40} />
            <div className="flex flex-col items-start">
              <SkeletonText className="w-full w-[100px]" />
              <SkeletonText fontSize="sm" className="w-full w-[60px]" />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <SkeletonText className="w-[80px]" />
            <SkeletonText fontSize="sm" align="right" className="w-[40px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
