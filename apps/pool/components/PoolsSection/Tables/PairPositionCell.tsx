import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { CellWithBalanceProps } from './types'

export const PairPositionCell: FC<CellWithBalanceProps> = ({ row }) => {
  const [token0, token1, slpToken] = useTokensFromPair(row)
  const { data: prices } = usePrices({ chainId: row.chainId })

  const [underlying0, underlying1] = useMemo(() => {
    const totalSupply = tryParseAmount(row.totalSupply, slpToken)
    const reserve0 = tryParseAmount(row.reserve0, token0)
    const reserve1 = tryParseAmount(row.reserve1, token1)
    const balance = tryParseAmount(row.liquidityTokenBalance, slpToken)

    if (!balance || !totalSupply || !reserve0 || !reserve1) {
      return [undefined, undefined]
    }

    return [reserve0.multiply(balance.divide(totalSupply)), reserve1.multiply(balance.divide(totalSupply))]
  }, [row.liquidityTokenBalance, row.reserve0, row.reserve1, row.totalSupply, slpToken, token0, token1])

  const value = useMemo(() => {
    const v0 = Number(underlying0?.toExact()) * Number(prices?.[token0.wrapped.address].toFixed(10))
    const v1 = Number(underlying1?.toExact()) * Number(prices?.[token1.wrapped.address].toFixed(10))
    return v0 + v1
  }, [prices, token0.wrapped.address, token1.wrapped.address, underlying0, underlying1])

  return (
    <Typography variant="sm" weight={600} className="text-slate-50">
      {formatUSD(value)}
    </Typography>
  )
}
