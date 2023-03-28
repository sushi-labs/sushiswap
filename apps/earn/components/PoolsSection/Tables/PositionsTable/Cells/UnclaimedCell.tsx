import { formatUSD } from '@sushiswap/format'
import { FC, useMemo } from 'react'

import { ConcentratedLiquidityPosition } from '@sushiswap/wagmi/future/hooks'
import { useToken } from '@sushiswap/react-query'
import { Row } from '../../SharedCells/types'
import { JSBI } from '@sushiswap/math'
import { useTokenAmountDollarValues } from '../../../../../lib/hooks'
import { Amount } from '@sushiswap/currency'

export const UnclaimedCell: FC<Row<ConcentratedLiquidityPosition>> = ({ row }) => {
  const { data: token0 } = useToken({ chainId: row.chainId, address: row.token0 })
  const { data: token1 } = useToken({ chainId: row.chainId, address: row.token1 })
  const amounts = useMemo(() => {
    if (row.fees && token0 && token1)
      return [
        Amount.fromRawAmount(token0, JSBI.BigInt(row.fees[0])),
        Amount.fromRawAmount(token1, JSBI.BigInt(row.fees[1])),
      ]

    return [undefined, undefined]
  }, [row.fees, token0, token1])

  const values = useTokenAmountDollarValues({ chainId: row.chainId, amounts: amounts })

  return (
    <span className="text-sm flex items-center justify-end gap-1 text-gray-900 dark:text-slate-50">
      {formatUSD(values[0] + values[1])}
    </span>
  )
}
