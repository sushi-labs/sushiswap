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
import { ConnectButton } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { formatUSD } from 'sushi/format'
import { useBarBalance } from './BarBalanceProvider'

export const BarBalanceCard = () => {
  const { sushiBalance, xSushiBalance, isConnected, isLoading } =
    useBarBalance()

  const amounts = useMemo(
    () => [sushiBalance ?? undefined, xSushiBalance ?? undefined],
    [sushiBalance, xSushiBalance],
  )

  const [sushiFiatValue, xSushiFiatValue] = useTokenAmountDollarValues({
    chainId: ChainId.ETHEREUM,
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
      {isConnected ? (
        <CardContent>
          <CardGroup>
            <CardLabel>Staked</CardLabel>
            <CardCurrencyAmountItem
              isLoading={isLoading && !xSushiBalance}
              amount={xSushiBalance ?? undefined}
              fiatValue={formatUSD(xSushiFiatValue)}
            />
          </CardGroup>
          <CardGroup>
            <CardLabel>Available</CardLabel>
            <CardCurrencyAmountItem
              isLoading={isLoading && !sushiBalance}
              amount={sushiBalance ?? undefined}
              fiatValue={formatUSD(sushiFiatValue)}
            />
          </CardGroup>
        </CardContent>
      ) : (
        <CardContent className="items-center">
          <ConnectButton
            variant="naked"
            size="lg"
            className="underline text-blue text-lg"
          >
            Connect Wallet
          </ConnectButton>
          <span className="italic text-sm text-muted-foreground">
            Please connect wallet to view your balance.
          </span>
        </CardContent>
      )}
    </Card>
  )
}
