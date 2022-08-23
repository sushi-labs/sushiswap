import { tryParseAmount } from '@sushiswap/currency'
import { formatPercent, formatUSD } from '@sushiswap/format'
import { Button, Chip, Currency, Link, Typography } from '@sushiswap/ui'
import { FC, useMemo } from 'react'

import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../../../lib/hooks'
import { PairWithBalance } from '../../../types'
import { ICON_SIZE } from './contants'

interface PositionQuickHoverTooltipProps {
  row: PairWithBalance
}

export const PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
  const { token0, token1, reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(row)
  const balance = useMemo(
    () => tryParseAmount(row.liquidityTokenBalance, liquidityToken),
    [row.liquidityTokenBalance, liquidityToken]
  )

  const rewardAPR = row.incentives.reduce((acc, cur) => acc + (cur.apr || 0), 0) || 0
  const totalAPR = rewardAPR / 100 + row.apr / 100

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0: reserve0.wrapped,
    reserve1: reserve1.wrapped,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: row.chainId, amounts: underlying })

  return (
    <div className="flex flex-col p-2 !pb-0">
      <div className="flex justify-between gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              <Currency.Icon currency={token0} />
              <Currency.Icon currency={token1} />
            </Currency.IconList>
            <div className="flex flex-col">
              <Typography variant="sm" weight={500} className="flex gap-1 text-slate-50">
                {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
              </Typography>
              <Typography variant="xxs" className="text-slate-400">
                SushiSwap Farm
              </Typography>
            </div>
          </div>
          <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
            <Chip color="gray" size="sm" label="Classic" />
            Fee {row.swapFee / 100}%
          </Typography>
        </div>
        <Typography variant="sm" weight={600} className="flex gap-3 text-slate-50">
          <span className="text-slate-400">APR:</span> {formatPercent(totalAPR)}
        </Typography>
      </div>
      <hr className="my-3 border-t border-slate-200/10" />
      <div className="flex flex-col gap-1.5">
        <Typography variant="xs" className="mb-1 text-slate-500">
          Position
        </Typography>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token0} width={18} height={18} />
            <Typography variant="sm" weight={600} className="text-slate-50">
              {underlying0?.toSignificant(6) || '0.00'} {token0?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(Number(value0))}
          </Typography>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Currency.Icon currency={token1} width={18} height={18} />
            <Typography variant="sm" weight={600} className="text-slate-50">
              {underlying1?.toSignificant(6) || '0.00'} {token1?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(Number(value1))}
          </Typography>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-8 mb-2">
        <Link.Internal href={`/${row.id}/remove`} passHref={true}>
          <Button as="a" size="sm" variant="outlined" fullWidth>
            Withdraw
          </Button>
        </Link.Internal>
        <Link.Internal href={`/${row.id}/add`} passHref={true}>
          <Button as="a" size="sm" fullWidth>
            Deposit
          </Button>
        </Link.Internal>
      </div>
    </div>
  )
}
