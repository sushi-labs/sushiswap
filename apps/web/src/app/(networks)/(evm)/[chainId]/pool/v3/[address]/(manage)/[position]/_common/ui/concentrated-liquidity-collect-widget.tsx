'use client'

import {
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardLabel,
  Switch,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { type FC, useMemo, useState } from 'react'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount, formatUSD } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  type Position,
  unwrapEvmToken,
} from 'sushi/evm'
import { ConcentratedLiquidityCollectButton } from './concentrated-liquidity-collect-button'

interface ConcentratedLiquidityCollectWidget {
  position: Position | undefined
  positionDetails: ConcentratedLiquidityPosition | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: EvmChainId
  isLoading: boolean
  address: EvmAddress | undefined
  amounts: undefined[] | Amount<EvmCurrency>[]
  fiatValuesAmounts: number[]
}

export const ConcentratedLiquidityCollectWidget: FC<
  ConcentratedLiquidityCollectWidget
> = ({
  position,
  positionDetails,
  token0,
  token1,
  chainId,
  isLoading,
  address,
  amounts,
  fiatValuesAmounts,
}) => {
  const [receiveWrapped, setReceiveWrapped] = useState(false)
  const nativeToken = useMemo(() => EvmNative.fromChainId(chainId), [chainId])

  const positionHasNativeToken = useMemo(() => {
    if (!nativeToken || !token0 || !token1) return false
    return (
      token0.type === 'native' ||
      token1.type === 'native' ||
      token0.address === nativeToken.wrap().address ||
      token1.address === nativeToken.wrap().address
    )
  }, [token0, token1, nativeToken])

  const expectedAmount0 = useMemo(() => {
    const expectedToken0 =
      !token0 || receiveWrapped ? token0?.wrap() : unwrapEvmToken(token0)
    if (amounts[0] === undefined || !expectedToken0) return undefined
    return new Amount(expectedToken0, amounts[0].amount)
  }, [token0, receiveWrapped, amounts])

  const expectedAmount1 = useMemo(() => {
    const expectedToken1 =
      !token1 || receiveWrapped ? token1?.wrap() : unwrapEvmToken(token1)
    if (amounts[1] === undefined || !expectedToken1) return undefined
    return new Amount(expectedToken1, amounts[1].amount)
  }, [token1, receiveWrapped, amounts])

  return (
    <>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            amount={expectedAmount0}
            isLoading={isLoading}
            fiatValue={formatUSD(fiatValuesAmounts[0])}
            unwrap={false}
          />
          <CardCurrencyAmountItem
            amount={expectedAmount1}
            isLoading={isLoading}
            fiatValue={formatUSD(fiatValuesAmounts[1])}
            unwrap={false}
          />
        </CardGroup>
        {positionHasNativeToken ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {`Receive ${nativeToken.wrap().symbol} instead of ${nativeToken.symbol}`}
            </span>
            <Switch
              checked={receiveWrapped}
              onCheckedChange={setReceiveWrapped}
            />
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <ConcentratedLiquidityCollectButton
          position={position ?? undefined}
          positionDetails={positionDetails}
          token0={expectedAmount0?.currency}
          token1={expectedAmount1?.currency}
          account={address}
          chainId={chainId}
        >
          {({ send, isPending }) => (
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={chainId}>
                <Button fullWidth size="xl" disabled={isPending} onClick={send}>
                  Collect
                </Button>
              </Checker.Network>
            </Checker.Connect>
          )}
        </ConcentratedLiquidityCollectButton>
      </CardFooter>
    </>
  )
}
