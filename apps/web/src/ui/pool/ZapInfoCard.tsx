import { SteerVault } from '@sushiswap/steer-sdk'
import {
  Card,
  CardContent,
  Collapsible,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { FC, useMemo } from 'react'
import { ZapResponse } from 'src/lib/hooks'
import {
  warningSeverity,
  warningSeverityClassName,
} from 'src/lib/swap/warningSeverity'
import { Type } from 'sushi/currency'
import { Percent, ZERO } from 'sushi/math'
import { SushiSwapV2Pool } from 'sushi/pool'
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

  return (
    <Collapsible open={Boolean(zapResponse)}>
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
              {!priceImpact ? (
                <SkeletonBox className="h-4 py-0.5 w-[40px]" />
              ) : priceImpact ? (
                `${
                  priceImpact?.lessThan(ZERO)
                    ? '+'
                    : priceImpact?.greaterThan(ZERO)
                      ? '-'
                      : ''
                }${Math.abs(Number(priceImpact?.toFixed(2)))}%`
              ) : null}
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
              <SkeletonText />
            )}
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  )
}
