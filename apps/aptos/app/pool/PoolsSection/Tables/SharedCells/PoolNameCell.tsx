import React, { FC } from 'react'
import { Row } from './types'
import { Pool } from 'utils/usePools'
import { useTokensFromPools } from 'utils/useTokensFromPool'
import { IconList } from 'components/IconList'
import { Icon } from 'components/Icon'
import { classNames } from '@sushiswap/ui'
import { isFarm, useFarms } from 'utils/useFarms'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'

export const PoolNameCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)
  const lpAddress = row?.id
  const { data: farms } = useFarms()
  const _isFarm = isFarm(lpAddress, farms)

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-[54px]">
        {token0 && token1 && (
          <IconList iconWidth={26} iconHeight={26}>
            <Icon currency={token0} />
            <Icon currency={token1} />
          </IconList>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {token0?.symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span> {token1?.symbol}{' '}
          <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')}></div>
        </span>
        <div className="flex gap-1">
          {_isFarm !== -1 && (
            <Tooltip description="Farm rewards available">
              <div className="bg-green/20 text-green text-[10px] px-2 rounded-full">🧑‍🌾</div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
