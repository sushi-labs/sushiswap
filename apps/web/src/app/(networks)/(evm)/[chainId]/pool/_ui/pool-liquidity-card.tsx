'use client'

import {
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { type Amount, formatUSD } from 'sushi'
import type { EvmChainId, EvmCurrency } from 'sushi/evm'

interface PoolLiquidityCardProps {
  chainId: EvmChainId
  reserves: Amount<EvmCurrency>[] | null | undefined
  isLoading: boolean
  /** Show wrapped native tokens as native; off for V4, where both can be pool tokens */
  unwrap?: boolean
}

/** The pool's reserves, priced live. */
export const PoolLiquidityCard: FC<PoolLiquidityCardProps> = ({
  chainId,
  reserves,
  isLoading,
  unwrap = true,
}) => {
  const fiatValues = useTokenAmountDollarValues({ chainId, amounts: reserves })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Liquidity</CardTitle>
        <CardDescription>
          {formatUSD(fiatValues[0] + fiatValues[1])}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            unwrap={unwrap}
            amount={reserves?.[0]}
            fiatValue={formatUSD(fiatValues[0])}
          />
          <CardCurrencyAmountItem
            isLoading={isLoading}
            unwrap={unwrap}
            amount={reserves?.[1]}
            fiatValue={formatUSD(fiatValues[1])}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
