import { formatNumber } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { classNames, NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { FC } from 'react'

import { useTokensFromPool } from '../../../../lib/hooks'
import { ICON_SIZE } from '../contants'
import { Row } from './types'
import { Badge } from '@sushiswap/ui/future/components/Badge'

export const PoolNameCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)

  return (
    <div className="flex items-center gap-5">
      <div className="hidden sm:flex">
        {token0 && token1 && (
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={row.chainId} width={14} height={14} />}
          >
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon disableLink currency={token0} />
              <Currency.Icon disableLink currency={token1} />
            </Currency.IconList>
          </Badge>
        )}
      </div>
      <div className="flex sm:hidden"></div>
      <div className="flex flex-col">
        <span className="text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          {token0?.symbol} <span className="text-gray-900 dark:text-slate-500">/</span> {token1?.symbol}{' '}
          <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')}></div>
        </span>
        <span className="text-xs text-gray-600 dark:text-slate-400 text-slate-600">
          {' '}
          {formatNumber(row.swapFee * 100)}%
        </span>
      </div>
    </div>
  )
}
