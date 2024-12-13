import { ClockIcon } from '@heroicons/react/24/outline'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { FC, useMemo } from 'react'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import {
  CrossChainRoute as CrossChainRouteType,
  CrossChainRouteOrder,
} from 'src/lib/swap/cross-chain/types'
import { Amount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { CrossChainFeesHoverCard } from './cross-chain-fees-hover-card'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

interface CrossChainRouteCardProps {
  route: CrossChainRouteType
  order: CrossChainRouteOrder
  isSelected: boolean
  onSelect: () => void
}

export const CrossChainRouteCard: FC<CrossChainRouteCardProps> = ({
  route,
  order,
  isSelected,
  onSelect,
}) => {
  const {
    state: { token1, chainId0, chainId1 },
  } = useDerivedStateCrossChainSwap()

  const { data: price } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrapped.address,
  })

  const amountOut = useMemo(
    () =>
      route?.toAmount && token1
        ? Amount.fromRawAmount(token1, route.toAmount)
        : undefined,
    [token1, route?.toAmount],
  )

  const amountOutUSD = useMemo(
    () =>
      price && amountOut
        ? `${(
            (price * Number(amountOut.quotient)) /
            10 ** amountOut.currency.decimals
          ).toFixed(2)}`
        : undefined,
    [amountOut, price],
  )

  const {
    step,
    executionDuration,
    feesBreakdown,
    gasFeesUSD,
    protocolFeesUSD,
    totalFeesUSD,
  } = useMemo(() => {
    const step = route.steps[0]
    const executionDurationSeconds = step.estimate.executionDuration
    const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

    const executionDuration =
      executionDurationSeconds < 60
        ? `${executionDurationSeconds} seconds`
        : `${executionDurationMinutes} minutes`

    const { feesBreakdown, totalFeesUSD, gasFeesUSD, protocolFeesUSD } =
      getCrossChainFeesBreakdown(route.steps)

    return {
      step,
      executionDuration,
      feesBreakdown,
      totalFeesUSD,
      gasFeesUSD,
      protocolFeesUSD,
    }
  }, [route?.steps])

  return (
    <Card
      variant="outline"
      onClick={onSelect}
      className={classNames(
        'cursor-pointer bg-white dark:!bg-black/[0.04] hover:border-blue hover:opacity-80',
        isSelected && 'border-blue',
      )}
    >
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>
              {amountOut && token1 ? (
                `${amountOut?.toSignificant(6)} ${token1?.symbol}`
              ) : (
                <div className="h-[18px] w-32">
                  <SkeletonText />
                </div>
              )}
            </CardTitle>
            <CardDescription>{`≈ ${amountOutUSD} after fees`}</CardDescription>
          </div>
          <span>
            {route.tags?.includes(order) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-gradient-to-r from-blue/20 to-pink/20">
                <span className="text-[10px] font-medium leading-5 saturate-200 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
                  {order === 'CHEAPEST' ? 'Best Return' : 'Fastest'}
                </span>
              </div>
            ) : route.tags?.includes(
                order === 'FASTEST' ? 'CHEAPEST' : 'FASTEST',
              ) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-blue/20">
                <span className="text-[10px] font-medium leading-5 text-blue">
                  {order === 'FASTEST' ? 'Best Return' : 'Fastest'}
                </span>
              </div>
            ) : null}
          </span>
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex justify-between items-center w-full text-sm font-semibold">
          <div className="flex gap-4 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {executionDuration}
            </span>
            <CrossChainFeesHoverCard
              feesBreakdown={feesBreakdown}
              gasFeesUSD={gasFeesUSD}
              protocolFeesUSD={protocolFeesUSD}
              chainId0={chainId0}
              chainId1={chainId1}
            >
              <span className="inline-flex items-center gap-1.5 underline decoration-dotted underline-offset-4">
                <GasIcon className="w-3.5 h-3.5" />
                {formatUSD(totalFeesUSD)}
              </span>
            </CrossChainFeesHoverCard>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <img
              src={step.toolDetails.logoURI}
              className="rounded-full"
              width={20}
              height={20}
              alt={step.toolDetails.name}
            />
            {step.toolDetails.name}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
