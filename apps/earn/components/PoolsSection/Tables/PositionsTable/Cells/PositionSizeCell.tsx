import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { Position } from '@sushiswap/v3-sdk'
import { JSBI } from '@sushiswap/math'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'

export const PositionSizeCell: FC<Row<ConcentratedLiquidityPositionWithV3Pool>> = ({ row }) => {
  const position = useMemo(() => {
    if (row.liquidity) {
      return new Position({
        pool: row.pool,
        liquidity: JSBI.BigInt(row.liquidity),
        tickLower: row.tickLower,
        tickUpper: row.tickUpper,
      })
    }

    return undefined
  }, [row.pool, row.liquidity, row.tickLower, row.tickUpper])

  const amounts = useMemo(() => [position?.amount0, position?.amount1], [position])
  const values = useTokenAmountDollarValues({ chainId: row.chainId, amounts: amounts })

  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {formatUSD(values[0] + values[1])}
    </span>
  )
}
