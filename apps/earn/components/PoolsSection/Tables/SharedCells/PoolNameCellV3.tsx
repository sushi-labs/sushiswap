import { formatNumber } from '@sushiswap/format'
import { classNames, NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { FC, useMemo } from 'react'

import { ICON_SIZE } from '../constants'
import { Row } from './types'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { unwrapToken } from '../../../../lib/functions'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'

export const PoolNameCellV3: FC<Row<ConcentratedLiquidityPositionWithV3Pool>> = ({ row }) => {
  const [_token0, _token1]: Type[] = useMemo(() => [unwrapToken(row.pool.token0), unwrapToken(row.pool.token1)], [row])
  return (
    <div className="flex items-center gap-5">
      <div className="hidden sm:flex">
        {_token0 && _token1 && (
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={row.chainId as ChainId} width={14} height={14} />}
          >
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon disableLink currency={_token0} />
              <Currency.Icon disableLink currency={_token1} />
            </Currency.IconList>
          </Badge>
        )}
      </div>
      <div className="flex sm:hidden"></div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-sm flex items-center gap-1 text-gray-900 dark:text-slate-50">
          {_token0?.symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span> {_token1?.symbol}{' '}
          <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')}></div>
        </span>
        <div className="flex gap-1">
          <div className="bg-blue/20 text-blue text-[10px] px-2 rounded-full">
            SushiSwap<sup>v3</sup>
          </div>
          <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
            {formatNumber(row.fee / 10000)}%
          </div>
        </div>
      </div>
    </div>
  )
}
