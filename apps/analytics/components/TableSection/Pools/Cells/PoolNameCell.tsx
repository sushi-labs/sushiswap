import { Pool } from '@sushiswap/client'
import { formatNumber } from '@sushiswap/format'
import { classNames, NetworkIcon, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokensFromPool } from '../../../../lib/hooks'
import { ICON_SIZE } from '../constants'
import { Row } from '../../Common/types'
import { ChainId } from '@sushiswap/chain'

export const PoolNameCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPool(row)

  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.chainId as ChainId} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-50">
          {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}{' '}
          <div className={classNames('bg-slate-700 rounded-lg px-1 py-0.5 ml-1')}>
            {formatNumber(Number(row.swapFee) * 100)}%
          </div>
        </Typography>
        <Typography variant="xxs" className="text-slate-400">
          {row.incentives.length > 0 ? 'Farm' : 'Pool'}
        </Typography>
      </div>
    </div>
  )
}
