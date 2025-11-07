'use client'

import { type RawV2Pool, hydrateV2Pool } from '@sushiswap/graph-client/data-api'
import {
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, formatPercent, formatUSD } from 'sushi'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'

interface PoolCompositionProps {
  pool: RawV2Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({
  pool: rawPool,
}) => {
  const pool = useMemo(() => hydrateV2Pool(rawPool), [rawPool])

  const amounts = useMemo(() => {
    return [
      new Amount(pool.token0, pool.reserve0),
      new Amount(pool.token1, pool.reserve1),
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
    <Wrapper enableBorder className="!p-4 flex flex-col gap-5">
      <CardHeader className="!p-0 flex !flex-row justify-between lg:items-start items-center lg:!flex-col gap-2">
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
            ({formatPercent(pool?.liquidityUSD1dChange)})
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="!p-0">
        <CardGroup className="lg:!gap-4">
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
