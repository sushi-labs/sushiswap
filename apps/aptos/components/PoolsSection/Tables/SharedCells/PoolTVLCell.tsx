import React, { FC, useMemo } from 'react'
import { formatUSD } from 'sushi/format'
import { Pool } from 'utils/hooks/usePools'
import { useStablePrice } from 'utils/hooks/useStablePrice'
import { useTokensFromPools } from 'utils/hooks/useTokensFromPool'
import { Row } from './types'

export const PoolTVLCell: FC<Row<Pool>> = ({ row }) => {
  const { token0, token1 } = useTokensFromPools(row)

  const [reserve0, reserve1] = useMemo(() => {
    return [row?.data?.balance_x?.value, row?.data?.balance_y?.value]
  }, [row])

  const token0Price = useStablePrice({ currency: token0 }) ?? 0
  const token1Price = useStablePrice({ currency: token1 }) ?? 0

  const reserve0Usd = token0Price * (Number(reserve0) / 10 ** token0.decimals)
  const reserve1Usd = token1Price * (Number(reserve1) / 10 ** token1.decimals)

  const poolTvl = reserve0Usd + reserve1Usd

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
          {formatUSD(poolTvl)}
        </span>
      </div>
    </div>
  )
}
