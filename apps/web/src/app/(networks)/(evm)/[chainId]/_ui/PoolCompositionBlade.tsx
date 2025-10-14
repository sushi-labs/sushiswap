'use client'

import { type RawV2Pool, hydrateV2Pool } from '@sushiswap/graph-client/data-api'
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
import { Amount, formatUSD } from 'sushi'
import { EvmToken } from 'sushi/evm'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'

interface PoolCompositionBladeProps {
  pool: RawV2Pool
}

export const PoolCompositionBlade: FC<PoolCompositionBladeProps> = ({
  pool: rawPool,
}) => {
  const pool = useMemo(() => hydrateV2Pool(rawPool), [rawPool])
  const amounts = useMemo(() => {
    const token0 = new EvmToken({
      chainId: pool.chainId,
      address: pool.token0.address,
      decimals: pool.token0.decimals,
      symbol: pool.token0.symbol,
      name: pool.token0.name,
    })

    const token1 = new EvmToken({
      chainId: pool.chainId,
      address: pool.token1.address,
      decimals: pool.token1.decimals,
      symbol: pool.token1.symbol,
      name: pool.token1.name,
    })
    return [
      Amount.tryFromHuman(token0, pool.reserve0),
      Amount.tryFromHuman(token1, pool.reserve1),
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
        <CardTitle className="text-slate-900 dark:lg:!text-slate-500 dark:!text-slate-100">
          TVL
        </CardTitle>

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
          <div className="hidden justify-between items-center lg:flex">
            <span className="text-base text-gray-500 lg:flex-row dark:text-slate-500">
              Show stablecoin types
            </span>
            <Switch />
          </div>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={amounts[0]}
            fiatValue={formatUSD(reserve0USD)}
            amountClassName="!font-medium"
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={amounts[1]}
            fiatValue={formatUSD(reserve1USD)}
            amountClassName="!font-medium"
          />
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
