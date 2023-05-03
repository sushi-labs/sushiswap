import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import {
  ConcentratedLiquidityPosition,
  useConcentratedLiquidityPool,
  useTokenWithCache,
} from '@sushiswap/wagmi/future/hooks'
import { Row } from '../../SharedCells/types'
import { JSBI } from '@sushiswap/math'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'
import { Amount } from '@sushiswap/currency'
import { unwrapToken } from '../../../../../lib/functions'

export const UnclaimedCell: FC<Row<ConcentratedLiquidityPosition>> = ({ row, ctx }) => {
  const { data: token0, isLoading: isToken0Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token0 })
  const { data: token1, isLoading: isToken1Loading } = useTokenWithCache({ chainId: row.chainId, address: row.token1 })
  const { isLoading: isPoolLoading } = useConcentratedLiquidityPool({
    chainId: row.chainId,
    token0,
    token1,
    feeAmount: row.fee,
  })

  const amounts = useMemo(() => {
    if (row.fees && token0 && token1)
      return [
        Amount.fromRawAmount(unwrapToken(token0), JSBI.BigInt(row.fees[0])),
        Amount.fromRawAmount(unwrapToken(token1), JSBI.BigInt(row.fees[1])),
      ]

    return [undefined, undefined]
  }, [row.fees, token0, token1])

  const values = useTokenAmountDollarValues({ chainId: row.chainId, amounts: amounts })
  const isLoading = isToken0Loading || isToken1Loading || isPoolLoading

  if (isLoading && ctx) return <>{ctx.column.columnDef.meta?.skeleton}</>

  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {formatUSD(values[0] + values[1])}
    </span>
  )
}
