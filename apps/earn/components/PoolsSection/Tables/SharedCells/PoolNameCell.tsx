import { formatNumber } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { useInViewport } from '@sushiswap/hooks'
import { classNames, Currency, NetworkIcon, Typography } from '@sushiswap/ui'
import { FC, useRef } from 'react'

import { useTokensFromPool } from '../../../../lib/hooks'
import { ICON_SIZE } from '../contants'
import { Row } from './types'

export const PoolNameCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)
  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="hidden sm:flex">
        <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
          <Currency.Icon disableLink currency={token0} priority={inViewport} />
          <Currency.Icon disableLink currency={token1} priority={inViewport} />
        </Currency.IconList>
      </div>
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.chainId} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          {token0.symbol} <span className="text-gray-900 dark:text-slate-500">/</span> {token1.symbol}{' '}
          <div className={classNames('bg-gray-200 dark:bg-slate-700 rounded-lg px-1 py-0.5 ml-1')}>
            {formatNumber(row.swapFee * 100)}%
          </div>
        </span>
        {/*<span className="text-xs text-gray-600 dark:text-slate-400">*/}
        {/*  {row.type === 'STABLE_POOL' && 'Stable'}*/}
        {/*  {row.type === 'CONSTANT_PRODUCT_POOL' && 'Classic'}*/}
        {/*</span>*/}
      </div>
    </div>
  )
}
