import { SteerVault } from '@sushiswap/steer-sdk'
import {
  Card,
  CardContent,
  Collapsible,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { EnsoIcon } from '@sushiswap/ui/icons/EnsoIcon'
import { FC, useMemo } from 'react'
import { ZapResponse } from 'src/lib/hooks'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { Type } from 'sushi/currency'
import { Percent, ZERO } from 'sushi/math'
import { SushiSwapV2Pool } from 'sushi/pool'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { ZapRouteDialog } from './ZapRouteDialog'

interface ZapInfoCardProps {
  zapResponse?: ZapResponse
  inputCurrency: Type
  pool: SushiSwapV2Pool | SteerVault | null
  tokenRatios?: { token0: number; token1: number }
}

export const ZapInfoCard: FC<ZapInfoCardProps> = ({
  zapResponse,
  inputCurrency,
  pool,
  tokenRatios,
}) => {
  const priceImpact = useMemo(
    () =>
      typeof zapResponse?.priceImpact === 'number'
        ? new Percent(zapResponse.priceImpact, 10_000)
        : undefined,
    [zapResponse],
  )

  const { data: price } = usePrice({
    chainId: inputCurrency?.chainId,
    address: inputCurrency?.wrapped?.address,
  })

  return (
    <>
      {zapResponse ? (
        <Collapsible open>
          <Card variant="outline">
            <CardContent className="!pt-3 !pb-3 !px-5">
              <div className="flex justify-between items-center gap-2">
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
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium">Route</span>
                {pool ? (
                  <ZapRouteDialog
                    inputCurrency={inputCurrency}
                    pool={pool}
                    tokenRatios={tokenRatios}
                  >
                    <span className="underline font-medium">View Route</span>
                  </ZapRouteDialog>
                ) : (
                  <SkeletonBox className="h-4 py-0.5 w-[80px]" />
                )}
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium">Fee (0.25%)</span>
                {typeof price !== 'undefined' &&
                typeof zapResponse?.feeAmount?.[0] !== 'undefined' ? (
                  `$${(
                    (price * Number(zapResponse.feeAmount[0])) /
                    10 ** inputCurrency.decimals
                  ).toFixed(5)}`
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
