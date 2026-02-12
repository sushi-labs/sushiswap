'use client'

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
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
import { Amount, formatUSD } from 'sushi'
import { EvmToken } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { useTokenAmountDollarValues } from '../../../../lib/hooks'
import { useSteerAccountPosition } from '../../hooks'

interface SteerPositionDetails {
  vault: VaultV1
}

export const SteerPositionDetails: FC<SteerPositionDetails> = ({ vault }) => {
  const { address } = useConnection()
  const { data: position, isLoading: isPositionLoading } =
    useSteerAccountPosition({
      account: address,
      vaultId: vault.id,
    })

  const currencies = useMemo(() => {
    const currency0 = new EvmToken({ ...vault.token0, chainId: vault.chainId })
    const currency1 = new EvmToken({ ...vault.token1, chainId: vault.chainId })

    return [currency0, currency1]
  }, [vault])

  const amounts = useMemo(() => {
    if (!position) return undefined

    const amount0 = Amount.fromHuman(currencies[0], position.token0Balance)
    const amount1 = Amount.fromHuman(currencies[1], position.token1Balance)

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
