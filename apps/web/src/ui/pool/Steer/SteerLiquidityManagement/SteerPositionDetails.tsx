'use client'

import type { SteerVault } from '@sushiswap/steer-sdk'
import {
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { useSteerAccountPosition } from 'src/lib/wagmi/hooks/steer/useSteerAccountPosition'
import { Amount, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { useAccount } from 'wagmi'
import { useTokenAmountDollarValues } from '../../../../lib/hooks'

interface SteerPositionDetails {
  vault: SteerVault
}

export const SteerPositionDetails: FC<SteerPositionDetails> = ({ vault }) => {
  const { address } = useAccount()
  const { data: position, isLoading: isPositionLoading } =
    useSteerAccountPosition({
      account: address,
      vaultId: vault.id,
    })

  const currencies = useMemo(() => {
    const currency0 = new Token({ ...vault.token0, chainId: vault.chainId })
    const currency1 = new Token({ ...vault.token1, chainId: vault.chainId })

    return [currency0, currency1]
  }, [vault])

  const amounts = useMemo(() => {
    if (!position) return undefined

    const amount0 = Amount.fromRawAmount(currencies[0], position.token0Balance)
    const amount1 = Amount.fromRawAmount(currencies[1], position.token1Balance)

    return [amount0, amount1]
  }, [position, currencies])

  const fiatValuesAmounts = useTokenAmountDollarValues({
    chainId: vault.chainId,
    amounts,
  })
  const fiatValuesAmountsTotal = useMemo(
    () => fiatValuesAmounts.reduce((acc, cur) => acc + cur, 0),
    [fiatValuesAmounts],
  )

  return (
    <>
      <CardHeader>
        <CardTitle>Position details</CardTitle>
        <CardDescription>{formatUSD(fiatValuesAmountsTotal)}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          {address && (
            <>
              <CardCurrencyAmountItem
                amount={amounts?.[0]}
                isLoading={isPositionLoading}
                fiatValue={formatUSD(fiatValuesAmounts[0])}
              />
              <CardCurrencyAmountItem
                amount={amounts?.[1]}
                isLoading={isPositionLoading}
                fiatValue={formatUSD(fiatValuesAmounts[1])}
              />
            </>
          )}
        </CardGroup>
      </CardContent>
    </>
  )
}
