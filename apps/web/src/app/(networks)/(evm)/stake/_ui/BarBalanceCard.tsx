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
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { formatUSD } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useBarBalance } from './BarBalanceProvider'

export const BarBalanceCard = () => {
  const { sushiBalance, xSushiBalance, isLoading } = useBarBalance()

  const amounts = useMemo(
    () => [sushiBalance, xSushiBalance],
    [sushiBalance, xSushiBalance],
  )

  const [sushiFiatValue, xSushiFiatValue] = useTokenAmountDollarValues({
    chainId: EvmChainId.ETHEREUM,
    amounts: amounts,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Balance</CardTitle>
        <CardDescription>
          {formatUSD(sushiFiatValue + xSushiFiatValue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Staked</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={xSushiBalance}
            fiatValue={formatUSD(xSushiFiatValue)}
          />
        </CardGroup>
        <CardGroup>
          <CardLabel>Available</CardLabel>
          <CardCurrencyAmountItem
            isLoading={isLoading}
            amount={sushiBalance}
            fiatValue={formatUSD(sushiFiatValue)}
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
