import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Button, Chip, Currency, Link, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, useMemo } from 'react'

import { useTokensFromPair } from '../../../lib/hooks'
import { PairWithBalance } from '../../../types'
import { ICON_SIZE } from './contants'

interface PositionQuickHoverTooltipProps {
  row: PairWithBalance
}

export const PositionQuickHoverTooltip: FC<PositionQuickHoverTooltipProps> = ({ row }) => {
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

  const [value0, value1] = useMemo(() => {
    const v0 = Number(underlying0?.toExact()) * Number(prices?.[token0.wrapped.address].toFixed(10))
    const v1 = Number(underlying1?.toExact()) * Number(prices?.[token1.wrapped.address].toFixed(10))
    return [v0, v1]
  }, [prices, token0.wrapped.address, token1.wrapped.address, underlying0, underlying1])

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
              <Typography variant="sm" weight={500} className="text-slate-50 flex gap-1">
                {token0.symbol} <span className="text-slate-500">/</span> {token1.symbol}
              </Typography>
              <Typography variant="xxs" className="text-slate-400">
                SushiSwap Farm
              </Typography>
            </div>
          </div>
          <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
            <Chip color="gray" size="sm" label="Classic" />
            Fee 0.5%
          </Typography>
        </div>
        <Typography variant="sm" weight={700} className="text-slate-50 flex gap-3">
          <span className="text-slate-400">APY:</span> 22.27%
        </Typography>
      </div>
      <hr className="border-t border-slate-200/10 my-3" />
      <div className="flex flex-col gap-1.5">
        <Typography variant="xs" className="text-slate-500 mb-1">
          Position
        </Typography>
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token0} width={18} height={18} />
            <Typography variant="sm" weight={700} className="text-slate-50">
              {underlying0?.toSignificant(6) || '0.00'} {token0?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(value0)}
          </Typography>
        </div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <Currency.Icon currency={token1} width={18} height={18} />
            <Typography variant="sm" weight={700} className="text-slate-50">
              {underlying1?.toSignificant(6) || '0.00'} {token1?.symbol}
            </Typography>
          </div>
          <Typography variant="xs" className="text-slate-400">
            {formatUSD(value1)}
          </Typography>
        </div>
      </div>
      <div className="flex gap-2 mt-8 mb-2 justify-end">
        <Link.Internal href={`/${row.id}/earn`} passHref={true}>
          <Button as="a" variant="empty" className="px-6" size="sm">
            Withdraw
          </Button>
        </Link.Internal>
        <Link.Internal href={`/${row.id}/earn`} passHref={true}>
          <Button as="a" className="px-6" size="sm">
            Deposit
          </Button>
        </Link.Internal>
      </div>
    </div>
  )
}
