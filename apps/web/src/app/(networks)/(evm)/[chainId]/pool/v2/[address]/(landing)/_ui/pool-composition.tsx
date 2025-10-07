'use client'

import { type RawV2Pool, hydrateV2Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  SkeletonText,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, formatUSD } from 'sushi'
import { EvmToken } from 'sushi/evm'

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

  const [reserve0USD, reserve1USD, reserveUSD] = useMemo(() => {
    if (isLoading) return [0, 0, 0]
    return [fiatValues[0], fiatValues[1], fiatValues[0] + fiatValues[1]]
  }, [fiatValues, isLoading])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {isLoading ? <SkeletonText /> : <>{formatUSD(reserveUSD)}</>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
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
    </Card>
  )
}
