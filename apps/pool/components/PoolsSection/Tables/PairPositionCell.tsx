import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'

import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../../lib/hooks'
import { CellWithBalanceProps } from './types'

export const PairPositionCell: FC<CellWithBalanceProps> = ({ row }) => {
  const { reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(row)
  const balance = useMemo(
    () => tryParseAmount(row.liquidityTokenBalance, liquidityToken),
    [row.liquidityTokenBalance, liquidityToken]
  )
  const underlying = useUnderlyingTokenBalanceFromPair({ reserve0, reserve1, totalSupply, balance })
  const [value0, value1] = useTokenAmountDollarValues({ chainId: row.chainId, amounts: underlying })

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {formatUSD(Number(value0) + Number(value1))}
    </Typography>
  )
}
