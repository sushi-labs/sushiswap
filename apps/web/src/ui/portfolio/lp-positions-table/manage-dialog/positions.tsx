import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api-portfolio'
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
import { useMemo } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { Amount, formatUSD, withoutScientificNotation } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  unwrapEvmToken,
} from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

export const Positions = ({
  position,
  hideButtons,
}: {
  position: PortfolioV2PositionPoolType
  hideButtons?: boolean
}) => {
  const { createQuery } = useCreateQuery()

  const [token0, token1] = useMemo(() => {
    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: position.position.token0.chainId as EvmChainId,
          address: position.position.token0.address as EvmAddress,
          decimals: position.position.token0.decimals,
          symbol: position.position.token0.symbol,
          name: position.position.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: position.position.token1.chainId as EvmChainId,
          address: position.position.token1.address as EvmAddress,
          decimals: position.position.token1.decimals,
          symbol: position.position.token1.symbol,
          name: position.position.token1.name,
        }),
      ),
    ]
  }, [position])

  const { data: priceMap } = usePrices({
    chainId: position.pool.chainId as EvmChainId,
  })

  const amounts = useMemo(
    () => [
      Amount.fromHuman(
        token0,
        withoutScientificNotation(position.position.amount0) ?? '0',
      ),
      Amount.fromHuman(
        token1,
        withoutScientificNotation(position.position.amount1) ?? '0',
      ),
    ],
    [position, token0, token1],
  )

  const [fiatAmount0, fiatAmount1] = useMemo(() => {
    const price0 = priceMap?.get(token0.wrap().address)
    const price1 = priceMap?.get(token1.wrap().address)
    const fiat0 = price0 ? amounts?.[0]?.mulHuman(price0) : 0
    const fiat1 = price1 ? amounts?.[1]?.mulHuman(price1) : 0
    return [fiat0, fiat1]
  }, [amounts, priceMap, token0, token1])

  return (
    <Card className="!bg-slate-50 dark:!bg-slate-800">
      <CardHeader className="!p-3 flex !flex-col justify-between md:items-center md:!flex-row gap-2">
        <div>
          <CardTitle className="mb-1">Positions</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD(position.position.amountUSD)}
          </CardDescription>
        </div>
        {hideButtons ? null : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                createQuery([
                  {
                    name: 'lpPosTab',
                    value: 'manage',
                  },
                  {
                    name: 'lpManageTab',
                    value: 'add',
                  },
                ])
              }}
              className="w-full md:w-fit"
            >
              Add Liquidity
            </Button>
            <Button
              onClick={() => {
                createQuery([
                  {
                    name: 'lpPosTab',
                    value: 'manage',
                  },
                  {
                    name: 'lpManageTab',
                    value: 'remove',
                  },
                ])
              }}
              className="w-full md:w-fit"
              variant="networks"
            >
              Remove Liquidity
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="!p-3">
        <CardGroup>
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[0]}
            fiatValue={formatUSD(fiatAmount0.toString())}
            amountClassName="!font-medium"
          />
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[1]}
            fiatValue={formatUSD(fiatAmount1.toString())}
            amountClassName="!font-medium"
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
