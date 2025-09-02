import {
  Card,
  CardContent,
  Collapsible,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { EnsoIcon } from '@sushiswap/ui/icons/EnsoIcon'
import { type FC, memo, useMemo } from 'react'
import type { V3ZapResponse } from 'src/lib/hooks'
import { getFeeString } from 'src/lib/swap/fee'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { type Amount, Percent, ZERO, formatUSD } from 'sushi'
import {
  type EvmCurrency,
  EvmToken,
  Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3Pool,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { ZapRouteDialog } from '../../_ui/zap-route-dialog'

interface V3ZapInfoCardProps {
  zapResponse: V3ZapResponse | undefined
  isZapError: boolean
  inputCurrencyAmount: Amount<EvmCurrency> | undefined
  pool: SushiSwapV3Pool | null
  tokenRatios?: { token0: number; token1: number }
}

export const V3ZapInfoCard: FC<V3ZapInfoCardProps> = memo(
  ({ zapResponse, isZapError, inputCurrencyAmount, pool, tokenRatios }) => {
    const { isConnected } = useAccount()
    const { data: prices } = usePrices({
      chainId: pool?.chainId,
    })

    const {
      isLoading = false,
      amountOutUSD,
      priceImpact,
      feeString,
    } = useMemo(() => {
      if (
        !prices ||
        !inputCurrencyAmount ||
        !zapResponse ||
        !pool ||
        typeof zapResponse.amountsOut[
          SUSHISWAP_V3_POSITION_MANAGER[pool.chainId].toLowerCase()
        ] === 'undefined'
      ) {
        return {
          isLoading: true,
        }
      }

      const inputCurrencyPrice = prices.getFraction(
        inputCurrencyAmount.currency.wrap().address,
      )
      const token0Price = prices.getFraction(pool.token0.address)
      const token1Price = prices.getFraction(pool.token1.address)

      const feeString = getFeeString({
        fromToken: new EvmToken({
          chainId: pool.chainId,
          address: SUSHISWAP_V3_POSITION_MANAGER[pool.chainId],
          decimals: 1,
          symbol: '',
          name: '',
        }),
        toToken: inputCurrencyAmount.currency,
        tokenOutPrice: inputCurrencyPrice,
        minAmountOut: inputCurrencyAmount,
      })

      const liquidity =
        zapResponse.amountsOut[
          SUSHISWAP_V3_POSITION_MANAGER[pool.chainId].toLowerCase()
        ]!

      const depositAction = (
        zapResponse.bundle[4]?.action === 'depositclmm'
          ? zapResponse.bundle[4]
          : zapResponse.bundle.find(({ action }) => action === 'depositclmm')
      ) as Extract<
        (typeof zapResponse.bundle)[number],
        { action: 'depositclmm' }
      >

      const position = new Position({
        pool,
        liquidity: liquidity,
        tickLower: depositAction.args.ticks[0],
        tickUpper: depositAction.args.ticks[1],
      })

      const amount0USD = token0Price
        ? +position.amount0.mul(token0Price).toString()
        : undefined
      const amount1USD = token1Price
        ? +position.amount1.mul(token1Price).toString()
        : undefined

      const amountOutUSD =
        typeof amount0USD === 'undefined' && typeof amount1USD === 'undefined'
          ? undefined
          : Number(amount0USD ?? 0) + Number(amount1USD ?? 0)
      const priceImpact = new Percent({
        numerator: zapResponse.priceImpact,
        denominator: 10_000n,
      })

      return {
        amountOutUSD,
        priceImpact,
        feeString,
      }
    }, [zapResponse, prices, inputCurrencyAmount, pool])

    return (
      <>
        <Collapsible
          open={
            Boolean(isConnected && inputCurrencyAmount?.gt(ZERO)) && !isZapError
          }
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
                      priceImpact.lt(ZERO)
                        ? '+'
                        : priceImpact.gt(ZERO)
                          ? '-'
                          : ''
                    }${Math.abs(Number(priceImpact.toString({ fixed: 2 })))}%`
                  ) : !zapResponse ? (
                    <SkeletonBox className="h-4 py-0.5 w-[40px]" />
                  ) : (
                    '-'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Route</span>
                {!isLoading && inputCurrencyAmount && pool ? (
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
                  <div className="flex items-center justify-end flex-wrap gap-x-2">
                    <span className="whitespace-nowrap">
                      1 SushiSwap V3 NFT
                    </span>
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
