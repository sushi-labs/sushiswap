import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import {
  ConcentratedLiquidityPosition,
  useConcentratedLiquidityPool,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { Position } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'

export const PositionSizeCell: FC<Row<ConcentratedLiquidityPosition>> = ({ row, ctx }) => {
  const { data: token0, isLoading: isToken0Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token0 })
  const { data: token1, isLoading: isToken1Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token1 })
  const { data: pool, isLoading: isPoolLoading } = useConcentratedLiquidityPool({
    chainId: row.chainId,
    token0,
    token1,
    feeAmount: row.fee,
  })

  const position = useMemo(() => {
    if (pool && row.liquidity) {
      return new Position({
        pool,
        liquidity: JSBI.BigInt(row.liquidity),
        tickLower: row.tickLower,
        tickUpper: row.tickUpper,
      })
    }

    return undefined
  }, [pool, row.liquidity, row.tickLower, row.tickUpper])

  const amounts = useMemo(() => [position?.amount0, position?.amount1], [position])
  const values = useTokenAmountDollarValues({ chainId: row.chainId, amounts: amounts })
  const isLoading = isToken0Loading || isToken1Loading || isPoolLoading

  if (isLoading && ctx) return <>{ctx.column.columnDef.meta?.skeleton}</>

  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {formatUSD(values[0] + values[1])}
    </span>
  )
}
