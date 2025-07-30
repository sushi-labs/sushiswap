import {
  Card,
  CardContent,
  Collapsible,
  FormattedNumber,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { EnsoIcon } from '@sushiswap/ui/icons/EnsoIcon'
import { type FC, memo, useMemo } from 'react'
import type { V2ZapResponse } from 'src/lib/hooks'
import { getFeeString } from 'src/lib/swap/fee'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import type { EvmChainId } from 'sushi/chain'
import { Amount, type Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Percent, ZERO } from 'sushi/math'
import { SushiSwapV2Pool } from 'sushi/pool'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { ZapRouteDialog } from './ZapRouteDialog'

interface V2ZapInfoCardProps {
  zapResponse: V2ZapResponse | undefined
  isZapError: boolean
  inputCurrencyAmount: Amount<Type> | undefined
  pool: SushiSwapV2Pool | null
  tokenRatios?: { token0: number; token1: number }
}

export const V2ZapInfoCard: FC<V2ZapInfoCardProps> = memo(
  ({ zapResponse, isZapError, inputCurrencyAmount, pool, tokenRatios }) => {
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

    const {
      isLoading = false,
      amountOut,
      amountOutUSD,
      priceImpact,
      feeString,
    } = useMemo(() => {
      if (
        !prices ||
        !inputCurrencyAmount ||
        !zapResponse ||
        !outputToken ||
        !pool
      ) {
        return {
          isLoading: true,
        }
      }

      const amountOut = Amount.fromRawAmount(outputToken, zapResponse.amountOut)

      const inputCurrencyPrice = prices.getFraction(
        inputCurrencyAmount.currency.wrapped.address,
      )
      const token0Price = prices.getFraction(pool.token0.address)
      const token1Price = prices.getFraction(pool.token1.address)

      const feeString = getFeeString({
        fromToken: pool.liquidityToken,
        toToken: inputCurrencyAmount.currency,
        tokenOutPrice: inputCurrencyPrice,
        minAmountOut: inputCurrencyAmount,
      })

      const reserve0USD = token0Price
        ? pool.reserve0.multiply(token0Price).toExact()
        : undefined
      const reserve1USD = token1Price
        ? pool.reserve1.multiply(token1Price).toExact()
        : undefined

      const amountOutUSD =
        (typeof reserve0USD === 'undefined' &&
          typeof reserve1USD === 'undefined') ||
        !totalSupply
          ? undefined
          : ((Number(reserve0USD ?? 0) + Number(reserve1USD ?? 0)) *
              Number(amountOut.quotient)) /
            Number(totalSupply.quotient)

      const priceImpact = new Percent(zapResponse.priceImpact, 10_000n)

      return {
        amountOut,
        amountOutUSD,
        priceImpact,
        feeString,
      }
    }, [
      zapResponse,
      prices,
      inputCurrencyAmount,
      pool,
      outputToken,
      totalSupply,
    ])

    return (
      <>
        <Collapsible
          open={Boolean(inputCurrencyAmount?.greaterThan(0) && !isZapError)}
        >
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
                {!isLoading && pool && inputCurrencyAmount ? (
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
                {isLoading ? (
                  <SkeletonBox className="h-4 py-0.5 w-[80px]" />
                ) : (
                  <div className="flex items-center gap-2">
                    {typeof amountOut !== 'undefined' ? (
                      <span>
                        <FormattedNumber number={amountOut.toExact()} /> LP
                        Tokens
                      </span>
                    ) : (
                      <SkeletonBox className="h-4 py-0.5 w-[40px]" />
                    )}
                    {typeof amountOutUSD !== 'undefined'
                      ? `(${formatUSD(amountOutUSD)})`
                      : ''}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Fee (0.25%)</span>
                {typeof feeString !== 'undefined' ? (
                  feeString
                ) : (
                  <SkeletonBox className="h-4 py-0.5 w-[80px]" />
                )}
              </div>
            </CardContent>
          </Card>
        </Collapsible>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Powered By</span>
            <EnsoIcon height={18} width={72} />
          </span>
        </div>
      </>
    )
  },
)
