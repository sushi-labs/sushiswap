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
import type { V3ZapResponse } from 'src/lib/hooks'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import type { EvmChainId } from 'sushi/chain'
import { SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/config'
import type { Amount, Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { Fraction, type Percent, ZERO } from 'sushi/math'
import { Position, type SushiSwapV3Pool } from 'sushi/pool'
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

interface V3ZapInfoCardProps {
  zapResponse?: V3ZapResponse
  inputCurrencyAmount: Amount<Type> | undefined
  pool: SushiSwapV3Pool | null
  tokenRatios?: { token0: number; token1: number }
}

export const V3ZapInfoCard: FC<V3ZapInfoCardProps> = ({
  zapResponse,
  inputCurrencyAmount,
  pool,
  tokenRatios,
}) => {
  const { data: prices } = usePrices({
    chainId: pool?.chainId as EvmChainId | undefined,
  })

  const { amountOutUSD, priceImpact, feeAmountUSD } = useMemo(() => {
    if (
      typeof inputCurrencyAmount === 'undefined' ||
      typeof zapResponse === 'undefined' ||
      pool === null ||
      typeof zapResponse.amountsOut[
        SUSHISWAP_V3_POSITION_MANAGER[pool.chainId].toLowerCase()
      ] === 'undefined'
    ) {
      return {
        outputAmount: undefined,
        outputAmountUSD: undefined,
        priceImpact: undefined,
        inputCurrencyPrice: undefined,
      }
    }

    const inputCurrencyPrice = prices?.get(
      inputCurrencyAmount.currency.wrapped.address,
    )
    const token0Price = prices?.get(pool.token0.address)
    const token1Price = prices?.get(pool.token1.address)

    const feeAmountUSD = getAmountUSD(
      inputCurrencyAmount.multiply(new Fraction(25, 10000)),
      inputCurrencyPrice,
    )

    const liquidity =
      zapResponse.amountsOut[
        SUSHISWAP_V3_POSITION_MANAGER[pool.chainId].toLowerCase()
      ]!

    const depositAction = (
      zapResponse.bundle[4]?.action === 'depositclmm'
        ? zapResponse.bundle[4]
        : zapResponse.bundle.find(({ action }) => action === 'depositclmm')
    ) as Extract<(typeof zapResponse.bundle)[number], { action: 'depositclmm' }>

    const position = new Position({
      pool,
      liquidity: liquidity,
      tickLower: depositAction.args.ticks[0],
      tickUpper: depositAction.args.ticks[1],
    })

    const amount0USD = getAmountUSD(position.amount0, token0Price)
    const amount1USD = getAmountUSD(position.amount1, token1Price)

    const amountOutUSD =
      typeof amount0USD === 'undefined' && typeof amount1USD === 'undefined'
        ? undefined
        : Number(amount0USD) + Number(amount1USD)
    const priceImpact = undefined as Percent | undefined

    // const priceImpact =
    //   typeof zapResponse.priceImpact === 'number'
    //     ? new Percent(zapResponse.priceImpact, 10_000n)
    //     : undefined

    return {
      amountOutUSD,
      priceImpact,
      feeAmountUSD,
    }
  }, [zapResponse, prices, inputCurrencyAmount, pool])

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
                  1 SushiSwap V3 NFT
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
