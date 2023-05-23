import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { JSBI } from '@sushiswap/math'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'
import { Amount } from '@sushiswap/currency'
import { unwrapToken } from '../../../../../lib/functions'

export const UnclaimedCell: FC<Row<ConcentratedLiquidityPositionWithV3Pool>> = ({ row }) => {
  const amounts = useMemo(() => {
    if (row.fees && row.pool.token0 && row.pool.token1)
      return [
        Amount.fromRawAmount(unwrapToken(row.pool.token0), JSBI.BigInt(row.fees[0])),
        Amount.fromRawAmount(unwrapToken(row.pool.token1), JSBI.BigInt(row.fees[1])),
      ]

    return [undefined, undefined]
  }, [row.fees, row.pool.token0, row.pool.token1])

  const values = useTokenAmountDollarValues({ chainId: row.chainId, amounts: amounts })

  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {formatUSD(values[0] + values[1])}
    </span>
  )
}
