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
import { ConnectButton, useBalancesWeb3 } from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { SUSHI, SUSHI_ADDRESS, XSUSHI, XSUSHI_ADDRESS } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'

export const BarBalanceCard = () => {
  const { isConnected, address } = useAccount()

  const { data: balances, isLoading } = useBalancesWeb3({
    chainId: ChainId.ETHEREUM,
    account: address,
    currencies: [SUSHI[ChainId.ETHEREUM], XSUSHI[ChainId.ETHEREUM]],
  })

  const [sushiBalance, xSushiBalance] = useMemo(
    () => [
      balances?.[SUSHI_ADDRESS[ChainId.ETHEREUM]],
      balances?.[XSUSHI_ADDRESS[ChainId.ETHEREUM]],
    ],
    [balances],
  )

  const [sushiFiatValue, xSushiFiatValue] = useTokenAmountDollarValues({
    chainId: ChainId.ETHEREUM,
    amounts: [sushiBalance, xSushiBalance],
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
