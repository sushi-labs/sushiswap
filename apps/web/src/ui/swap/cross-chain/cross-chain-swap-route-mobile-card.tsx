import { ClockIcon } from '@heroicons/react/24/outline'
import { Card, SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { type FC, useMemo } from 'react'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import type {
  CrossChainRouteOrder,
  CrossChainRoute as CrossChainRouteType,
} from 'src/lib/swap/cross-chain/types'
import { Amount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { CrossChainSwapFeesHoverCard } from './cross-chain-swap-fees-hover-card'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-context'

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

  const { data: price, isLoading: isPriceLoading } = usePrice({
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
    const step = route?.step
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
      getCrossChainFeesBreakdown(step)

    return {
      step,
      executionDuration,
      feesBreakdown,
      totalFeesUSD,
      gasFeesUSD,
      protocolFeesUSD,
    }
  }, [route?.step])

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
              <span className="w-28">
                <SkeletonText fontSize="sm" />
              </span>
            )}
            {amountOutUSD ? (
              <span className="text-sm text-muted-foreground">
                ≈ ${amountOutUSD} after fees
              </span>
            ) : (
              <span
                className={classNames(
                  'w-36',
                  !isPriceLoading ? 'invisible' : '',
                )}
              >
                <SkeletonText fontSize="sm" />
              </span>
            )}
            {route?.tags?.includes(order) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-gradient-to-r from-blue/20 to-pink/20">
                <span className="text-[10px] font-medium leading-5 saturate-200 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent whitespace-nowrap">
                  {order === 'CHEAPEST' ? 'Best Return' : 'Fastest'}
                </span>
              </div>
            ) : route?.tags?.includes(
                order === 'FASTEST' ? 'CHEAPEST' : 'FASTEST',
              ) ? (
              <div className="flex justify-center items-center rounded-full px-2 bg-blue/20">
                <span className="text-[10px] font-medium leading-5 text-blue whitespace-nowrap">
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
    </Card>
  )
}
