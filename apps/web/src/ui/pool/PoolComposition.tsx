'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Switch,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Wrapper } from '../swap/trade/wrapper'

interface PoolCompositionProps {
  pool: V2Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const amounts = useMemo(() => {
    const token0 = new Token({
      chainId: pool.chainId,
      address: pool.token0.address,
      decimals: pool.token0.decimals,
      symbol: pool.token0.symbol,
      name: pool.token0.name,
    })

    const token1 = new Token({
      chainId: pool.chainId,
      address: pool.token1.address,
      decimals: pool.token1.decimals,
      symbol: pool.token1.symbol,
      name: pool.token1.name,
    })
    return [
      Amount.fromRawAmount(token0, pool.reserve0),
      Amount.fromRawAmount(token1, pool.reserve1),
    ]
  }, [pool])

  const fiatValues = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts,
  })

  const isLoading = fiatValues.length !== amounts.length

  const [reserve0USD, reserve1USD] = useMemo(() => {
    if (isLoading) return [0, 0]
    return [fiatValues[0], fiatValues[1]]
  }, [fiatValues, isLoading])

  return (
    <Wrapper enableBorder className="!p-3 flex flex-col gap-5">
      <CardHeader className="!p-0 flex !flex-row justify-between items-center lg:flex-col gap-1">
        <CardTitle className="text-slate-900">TVL</CardTitle>

        <CardDescription className="!mt-0 font-bold lg:font-medium text-sm  lg:!text-2xl flex items-center">
          {formatUSD(fiatValues[0] + fiatValues[1])}{' '}
          <span
            className={classNames(
              'text-sm lg:text-base font-medium',
              pool?.liquidityUSD1dChange && pool?.liquidityUSD1dChange > 0
                ? 'text-green'
                : 'text-red',
            )}
          >
            ({pool?.liquidityUSD1dChange.toFixed(2)}%)
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-6">
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={amounts[0]}
            fiatValue={formatUSD(reserve0USD)}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={amounts[1]}
            fiatValue={formatUSD(reserve1USD)}
          />
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
