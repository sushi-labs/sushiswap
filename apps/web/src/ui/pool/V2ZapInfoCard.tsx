import {
  Card,
  CardContent,
  Collapsible,
  FormattedNumber,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { EnsoIcon } from '@sushiswap/ui/icons/EnsoIcon'
import { type FC, useMemo } from 'react'
import type { V2ZapResponse } from 'src/lib/hooks'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import type { EvmChainId } from 'sushi/chain'
import { Amount, type Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Percent, ZERO } from 'sushi/math'
import { SushiSwapV2Pool, type SushiSwapV3Pool } from 'sushi/pool'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { ZapRouteDialog } from './ZapRouteDialog'

const getAmountUSD = (
  amount: Amount<Type> | undefined,
  price: number | undefined,
) => {
  if (typeof amount === 'undefined' || typeof price === 'undefined')
    return undefined
  return (price * Number(amount.quotient)) / 10 ** amount.currency.decimals
}

interface V2ZapInfoCardProps {
  zapResponse?: V2ZapResponse
  inputCurrencyAmount: Amount<Type> | undefined
  pool: SushiSwapV2Pool | null
  tokenRatios?: { token0: number; token1: number }
}

export const V2ZapInfoCard: FC<V2ZapInfoCardProps> = ({
  zapResponse,
  inputCurrencyAmount,
  pool,
  tokenRatios,
}) => {
  const { data: prices } = usePrices({
    chainId: pool?.chainId as EvmChainId | undefined,
  })

  const outputToken = useMemo(
    () =>
      !pool
        ? undefined
        : pool instanceof SushiSwapV2Pool
          ? pool.liquidityToken
          : undefined,
    [pool],
  )

  const totalSupply = useTotalSupply(outputToken)

  const { amountOut, amountOutUSD, priceImpact, feeAmountUSD } = useMemo(() => {
    if (
      typeof inputCurrencyAmount === 'undefined' ||
      typeof zapResponse === 'undefined' ||
      typeof outputToken === 'undefined' ||
      pool === null
    ) {
      return {
        outputAmount: undefined,
        outputAmountUSD: undefined,
        priceImpact: undefined,
        inputCurrencyPrice: undefined,
      }
    }

    const amountOut = Amount.fromRawAmount(outputToken, zapResponse.amountOut)

    const inputCurrencyPrice = prices?.get(
      inputCurrencyAmount.currency.wrapped.address,
    )
    const token0Price = prices?.get(pool.token0.address)
    const token1Price = prices?.get(pool.token1.address)

    const feeAmountUSD = getAmountUSD(
      zapResponse.feeAmount && zapResponse.feeAmount.length > 0
        ? Amount.fromRawAmount(
            inputCurrencyAmount.currency,
            zapResponse.feeAmount[0],
          )
        : undefined,
      inputCurrencyPrice,
    )

    const reserve0USD = getAmountUSD(pool.reserve0, token0Price)
    const reserve1USD = getAmountUSD(pool.reserve1, token1Price)

    const amountOutUSD =
      !reserve0USD || !reserve1USD || !totalSupply
        ? undefined
        : ((reserve0USD + reserve1USD) * Number(amountOut.quotient)) /
          Number(totalSupply.quotient)

    const priceImpact = new Percent(zapResponse.priceImpact, 10_000n)

    return {
      amountOut,
      amountOutUSD,
      priceImpact,
      feeAmountUSD,
    }
  }, [zapResponse, prices, inputCurrencyAmount, pool, outputToken, totalSupply])

  return (
    <>
      {zapResponse ? (
        <Collapsible open>
          <Card variant="outline">
            <CardContent className="!pt-3 !pb-3 !px-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Price impact</span>
                <span
                  className={classNames(
                    warningSeverityClassName(warningSeverity(priceImpact)),
                    'text-sm font-medium text-right',
                  )}
                >
                  {priceImpact ? (
                    `${
                      priceImpact.lessThan(ZERO)
                        ? '+'
                        : priceImpact.greaterThan(ZERO)
                          ? '-'
                          : ''
                    }${Math.abs(Number(priceImpact.toFixed(2)))}%`
                  ) : !zapResponse ? (
                    <SkeletonBox className="h-4 py-0.5 w-[40px]" />
                  ) : (
                    '-'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Route</span>
                {pool && inputCurrencyAmount ? (
                  <ZapRouteDialog
                    inputCurrency={inputCurrencyAmount.currency}
                    pool={pool}
                    tokenRatios={tokenRatios}
                  >
                    <span className="font-medium underline">View Route</span>
                  </ZapRouteDialog>
                ) : (
                  <SkeletonBox className="h-4 py-0.5 w-[80px]" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Est. Received</span>
                <div className="flex items-center gap-2">
                  {typeof amountOut !== 'undefined' ? (
                    <span>
                      <FormattedNumber number={amountOut.toExact()} /> LP Tokens
                    </span>
                  ) : (
                    <SkeletonBox className="h-4 py-0.5 w-[40px]" />
                  )}
                  {typeof amountOutUSD !== 'undefined' ? (
                    `(${formatUSD(amountOutUSD)})`
                  ) : (
                    <SkeletonBox className="h-4 py-0.5 w-[40px]" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Fee (0.25%)</span>
                {typeof feeAmountUSD !== 'undefined' ? (
                  `$${feeAmountUSD.toFixed(5)}`
                ) : (
                  <SkeletonBox className="h-4 py-0.5 w-[80px]" />
                )}
              </div>
            </CardContent>
          </Card>
        </Collapsible>
      ) : null}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Powered By</span>
          <EnsoIcon height={18} width={72} />
        </span>
      </div>
    </>
  )
}
