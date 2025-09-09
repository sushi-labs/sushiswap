import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { ConcentratedLiquidityCollectButton } from 'src/ui/pool/ConcentratedLiquidityCollectButton'
import { type Address, type EvmChainId, type Position, formatUSD } from 'sushi'
import { Amount, type Type, unwrapToken } from 'sushi/currency'

export const Fees = ({
  position,
  chainId,
  token0,
  token1,
  amounts,
  positionDetails,
  account,
}: {
  position: Position | undefined
  chainId: EvmChainId
  token0: Type | undefined
  token1: Type | undefined
  amounts: Amount<Type>[] | undefined[]
  positionDetails: ConcentratedLiquidityPosition | undefined
  account: Address | undefined
}) => {
  const [receiveWrapped] = useState(false)

  const expectedAmount0 = useMemo(() => {
    const expectedToken0 =
      !token0 || receiveWrapped ? token0?.wrapped : unwrapToken(token0)
    if (amounts[0] === undefined || !expectedToken0) return undefined
    return Amount.fromRawAmount(expectedToken0, amounts[0].quotient)
  }, [token0, receiveWrapped, amounts])

  const expectedAmount1 = useMemo(() => {
    const expectedToken1 =
      !token1 || receiveWrapped ? token1?.wrapped : unwrapToken(token1)
    if (amounts[1] === undefined || !expectedToken1) return undefined
    return Amount.fromRawAmount(expectedToken1, amounts[1].quotient)
  }, [token1, receiveWrapped, amounts])

  return (
    <Card className="!bg-slate-50 dark:!bg-slate-800">
      <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
        <div>
          <CardTitle className="mb-1">Fees</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD('49123')}
          </CardDescription>
        </div>
        <ConcentratedLiquidityCollectButton
          position={position ?? undefined}
          positionDetails={positionDetails}
          token0={expectedAmount0?.currency}
          token1={expectedAmount1?.currency}
          account={account}
          chainId={chainId}
        >
          {({ send, isPending }) => (
            <Checker.Network size="default" fullWidth={false} chainId={chainId}>
              <Button
                className="w-[128px]"
                disabled={isPending}
                onClick={send}
                size="default"
              >
                Collect
              </Button>
            </Checker.Network>
          )}
        </ConcentratedLiquidityCollectButton>
      </CardHeader>

      <CardContent className="!p-3">
        <CardGroup>
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[0]}
            fiatValue={formatUSD(1234)}
            amountClassName="!font-medium"
          />
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[1]}
            fiatValue={formatUSD(4321)}
            amountClassName="!font-medium"
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
