import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import type { ConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/types'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { Amount, formatUSD } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  type Position,
  unwrapEvmToken,
} from 'sushi/evm'
import type { Address } from 'viem'
import { ConcentratedLiquidityCollectButton } from '~evm/[chainId]/pool/v3/[address]/(manage)/[position]/_common/ui/concentrated-liquidity-collect-button'

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
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  amounts: Amount<EvmCurrency>[] | undefined[]
  positionDetails: ConcentratedLiquidityPosition | undefined
  account: Address | undefined
}) => {
  const [receiveWrapped] = useState(false)

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

  const fiatValuesAmounts = useTokenAmountDollarValues({ chainId, amounts })

  return (
    <Card className="!bg-slate-50 dark:!bg-slate-800">
      <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
        <div>
          <CardTitle className="mb-1">Fees</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD(fiatValuesAmounts[0] + fiatValuesAmounts[1])}
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

      <CardContent
        className={classNames(fiatValuesAmounts.length > 0 ? '!p-3' : '!p-0')}
      >
        <CardGroup>
          {fiatValuesAmounts.map((fiatValue, index) => (
            <CardCurrencyAmountItem
              key={index}
              isLoading={false}
              amount={amounts[index]}
              fiatValue={formatUSD(fiatValue)}
              amountClassName="!font-medium"
            />
          ))}
        </CardGroup>
      </CardContent>
    </Card>
  )
}
