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
import { FC, useMemo, useState } from 'react'
import { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Address, ChainId, Position } from 'sushi'
import { Amount, Native, Type, unwrapToken } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { ConcentratedLiquidityCollectButton } from './ConcentratedLiquidityCollectButton'

interface ConcentratedLiquidityCollectWidget {
  position: Position | undefined
  positionDetails: ConcentratedLiquidityPosition | undefined
  token0: Type | undefined
  token1: Type | undefined
  chainId: ChainId
  isLoading: boolean
  address: Address | undefined
  amounts: undefined[] | Amount<Type>[]
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
  const nativeToken = useMemo(() => Native.onChain(chainId), [chainId])

  const positionHasNativeToken = useMemo(() => {
    if (!nativeToken || !token0 || !token1) return false
    return (
      token0.isNative ||
      token1.isNative ||
      token0.address === nativeToken?.wrapped?.address ||
      token1.address === nativeToken?.wrapped?.address
    )
  }, [token0, token1, nativeToken])

  const expectedToken0 = useMemo(() => {
    return !token0 || receiveWrapped ? token0?.wrapped : unwrapToken(token0)
  }, [token0, receiveWrapped])

  const expectedToken1 = useMemo(() => {
    return !token1 || receiveWrapped ? token1?.wrapped : unwrapToken(token1)
  }, [token1, receiveWrapped])

  return (
    <>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            amount={amounts[0]}
            isLoading={isLoading}
            fiatValue={formatUSD(fiatValuesAmounts[0])}
          />
          <CardCurrencyAmountItem
            amount={amounts[1]}
            isLoading={isLoading}
            fiatValue={formatUSD(fiatValuesAmounts[1])}
          />
        </CardGroup>
        {positionHasNativeToken ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {`Receive ${nativeToken.wrapped.symbol} as ${nativeToken.symbol}`}
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
          token0={expectedToken0}
          token1={expectedToken1}
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
