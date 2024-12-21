import { ClockIcon } from '@heroicons/react/24/outline'
import { Card, SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { FC, useMemo } from 'react'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import type {
  CrossChainRoute as CrossChainRouteType,
  CrossChainRouteOrder,
} from 'src/lib/swap/cross-chain/types'
import { Amount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { CrossChainSwapFeesHoverCard } from './cross-chain-swap-fees-hover-card'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

interface CrossChainSwapRouteMobileCardProps {
  route: CrossChainRouteType | undefined
  order: CrossChainRouteOrder
  isSelected: boolean
  onSelect?: () => void
}

export const CrossChainSwapRouteMobileCard: FC<
  CrossChainSwapRouteMobileCardProps
> = ({ route, order, isSelected, onSelect }) => {
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
    const step = route?.steps[0]
    if (!step)
      return {
        step,
        executionDuration: undefined,
        feesBreakdown: undefined,
        gasFeesUSD: undefined,
        protocolFeesUSD: undefined,
        totalFeesUSD: undefined,
      }

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
      <div className="p-3 flex gap-3 items-center">
        {step ? (
          <img
            src={step.toolDetails.logoURI}
            className="rounded-full"
            width={40}
            height={40}
            alt={step.toolDetails.name}
          />
        ) : (
          <SkeletonCircle radius={40} />
        )}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center">
            {amountOut && token1 ? (
              <span className="text-sm font-semibold">
                {amountOut?.toSignificant(6)} {token1?.symbol}
              </span>
            ) : (
              <div className="w-28">
                <SkeletonText fontSize="sm" />
              </div>
            )}
            {amountOutUSD ? (
              <span className="text-sm text-muted-foreground">
                ≈ ${amountOutUSD} after fees
              </span>
            ) : (
              <div className="w-36">
                <SkeletonText fontSize="sm" />
              </div>
            )}
            {route?.tags?.includes(order) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-gradient-to-r from-blue/20 to-pink/20">
                <span className="text-[10px] font-medium leading-5 saturate-200 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
                  {order === 'CHEAPEST' ? 'Best Return' : 'Fastest'}
                </span>
              </div>
            ) : route?.tags?.includes(
                order === 'FASTEST' ? 'CHEAPEST' : 'FASTEST',
              ) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-blue/20">
                <span className="text-[10px] font-medium leading-5 text-blue">
                  {order === 'FASTEST' ? 'Best Return' : 'Fastest'}
                </span>
              </div>
            ) : null}
          </div>
          <div className="flex gap-[18px] text-muted-foreground h-5">
            {executionDuration ? (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold">
                <ClockIcon className="w-4 h-4" />
                {executionDuration}
              </span>
            ) : (
              <span className="w-24">
                <SkeletonText fontSize="sm" />
              </span>
            )}
            {feesBreakdown ? (
              <CrossChainSwapFeesHoverCard
                feesBreakdown={feesBreakdown}
                gasFeesUSD={gasFeesUSD}
                protocolFeesUSD={protocolFeesUSD}
                chainId0={chainId0}
                chainId1={chainId1}
              >
                <span className="inline-flex items-center gap-1.5 underline decoration-dotted underline-offset-4 -mb-1 text-sm font-semibold">
                  <GasIcon className="w-3.5 h-3.5" />
                  {formatUSD(totalFeesUSD)}
                </span>
              </CrossChainSwapFeesHoverCard>
            ) : (
              <span className="w-20">
                <SkeletonText fontSize="sm" />
              </span>
            )}
          </div>
        </div>
      </div>
      {/* <CardHeader>
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
      {isSelected && step.includedSteps.length > 1 ? (
        <>
          <Separator className="mb-5" />
          <CardContent className="!p-5 !pt-0">
            <CrossChainSwapRouteView step={step} />
          </CardContent>
          <Separator className="mb-5" />
        </>
      ) : null}
      <CardFooter className="overflow-hidden">
        <div className="flex justify-between items-center w-full text-sm font-semibold overflow-hidden gap-4">
          <div className="flex-1 flex gap-4 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <ClockIcon className="w-4 h-4" />
              {executionDuration}
            </span>
            <CrossChainSwapFeesHoverCard
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
            </CrossChainSwapFeesHoverCard>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <img
              src={step.toolDetails.logoURI}
              className="rounded-full"
              width={20}
              height={20}
              alt={step.toolDetails.name}
            />
            <span className="text-ellipsis whitespace-nowrap">
              {step.toolDetails.name}
            </span>
          </span>
        </div>
      </CardFooter> */}
    </Card>
  )
}
