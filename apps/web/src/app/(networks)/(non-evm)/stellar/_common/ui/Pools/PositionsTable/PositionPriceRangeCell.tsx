import { ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react-v1/solid'
import { FormattedNumber, SkeletonText, classNames } from '@sushiswap/ui'
import { usePoolInfo } from '~stellar/_common/lib/hooks'
import { calculatePriceFromTick } from '~stellar/_common/lib/soroban'
import type { IPositionRowData } from './PositionsTable'

export const PositionPriceRangeCell = ({
  data,
}: { data: IPositionRowData }) => {
  const { tickLower, tickUpper, token0, token1, pool, liquidity } = data
  const { data: poolInfo, isPending: isPendingPoolInfo } = usePoolInfo(pool)

  const closed = Number.parseFloat(liquidity) === 0
  const invalidRange = Boolean(tickLower >= tickUpper)
  const inRange = poolInfo
    ? tickLower <= poolInfo.tick && poolInfo.tick <= tickUpper
    : undefined

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            invalidRange || inRange === false
              ? 'bg-red'
              : closed
                ? 'bg-slate-700'
                : 'bg-green',
            'w-2 h-2 rounded-full',
          )}
        />
        <span className="whitespace-nowrap text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          <FormattedNumber number={calculatePriceFromTick(tickLower)} />
          {token1.code}
          <div className="flex items-center">
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
          </div>
          <FormattedNumber number={calculatePriceFromTick(tickUpper)} />

          {token1.code}
        </span>
      </div>
      <span className="text-xs flex items-center gap-1 text-gray-900 dark:text-slate-500">
        Current:
        {isPendingPoolInfo || !poolInfo ? (
          <SkeletonText />
        ) : (
          <FormattedNumber number={calculatePriceFromTick(poolInfo.tick)} />
        )}
        {token1.code} per {token0.code}{' '}
      </span>
    </div>
  )
}
