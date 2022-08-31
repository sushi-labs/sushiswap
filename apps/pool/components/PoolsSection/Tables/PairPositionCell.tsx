import { Amount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { AppearOnMount, Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'

import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../../lib/hooks'
import { StakedPositionFetcher } from '../../StakedPositionFetcher'
import { CellWithBalanceProps } from './types'

export const PairPositionCell: FC<CellWithBalanceProps> = ({ row }) => {
  const { reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(row)
  const balance = useMemo(
    () => Amount.fromRawAmount(liquidityToken, row.liquidityTokenBalance),
    [row.liquidityTokenBalance, liquidityToken]
  )

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: reserve0.wrapped,
    reserve1: reserve1.wrapped,
    totalSupply,
    balance,
  })

  const [value0, value1] = useTokenAmountDollarValues({ chainId: row.chainId, amounts: underlying })
  if (row.farmId !== undefined && row.chefType !== undefined) {
    return (
      <AppearOnMount>
        <StakedPositionFetcher
          liquidityToken={liquidityToken}
          totalSupply={totalSupply}
          reserve0={reserve0}
          reserve1={reserve1}
          chefType={row.chefType}
          farmId={row.farmId}
          chainId={row.chainId}
        >
          {({ value0: stakedValue0, value1: stakedValue1 }) => (
            <Typography variant="sm" weight={600} className="text-slate-50">
              {formatUSD(Number(value0) + Number(value1) + Number(stakedValue0) + Number(stakedValue1))}
            </Typography>
          )}
        </StakedPositionFetcher>
      </AppearOnMount>
    )
  }

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {formatUSD(Number(value0) + Number(value1))}
    </Typography>
  )
}
