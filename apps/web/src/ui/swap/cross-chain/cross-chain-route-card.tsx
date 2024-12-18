import { ChevronDoubleRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Currency,
  Separator,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { GasIcon } from '@sushiswap/ui/icons/GasIcon'
import React, { FC, useMemo } from 'react'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import type {
  CrossChainAction as CrossChainActionType,
  CrossChainRoute as CrossChainRouteType,
  CrossChainRouteOrder,
  CrossChainToolDetails as CrossChainToolDetailsType,
} from 'src/lib/swap/cross-chain/types'
import { Chain, ChainId } from 'sushi/chain'
import { Amount, Native, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { zeroAddress } from 'viem'
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
      {isSelected && step?.includedSteps.length > 1 ? (
        <>
          <Separator className="mb-6" />
          <CardContent>
            <div className={'flex gap-2 justify-center'}>
              {step.includedSteps.map((_step, index) => {
                return (
                  <React.Fragment key={`step-${_step.id}`}>
                    {_step.type === 'swap' ? (
                      <SwapAction chainId0={chainId0} action={_step.action} />
                    ) : _step.type === 'cross' ? (
                      <BridgeAction
                        action={_step.action}
                        toolDetails={_step.toolDetails}
                      />
                    ) : null}
                    {index < step.includedSteps.length - 1 ? (
                      <div className="flex flex-1 items-center gap-1">
                        <span className="bg-blue/20 w-2 h-2 rounded-full" />
                        <svg
                          className="flex-1 h-[2px] w-full"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 100 1"
                        >
                          <line
                            x1="0"
                            y1="0.5"
                            x2="100"
                            y2="0.5"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="4"
                            strokeDasharray="10 5"
                            strokeLinecap="butt"
                          />
                        </svg>
                        <span className="bg-blue/20 w-2 h-2 rounded-full" />
                      </div>
                    ) : null}
                  </React.Fragment>
                )
              })}
            </div>
          </CardContent>
          <Separator className="mb-6" />
        </>
      ) : null}
      <CardFooter className="overflow-hidden">
        <div className="flex justify-between items-center w-full text-sm font-semibold overflow-hidden gap-4">
          <div className="flex-1 flex gap-4 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
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
            <span className="text-ellipsis whitespace-nowrap">
              {step.toolDetails.name}
            </span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

const SwapAction: FC<{
  action: CrossChainActionType
  chainId0: ChainId
}> = ({ chainId0, action }) => {
  const { fromToken, toToken, label, chain } = useMemo(() => {
    const [label, chain] =
      chainId0 === action.fromToken.chainId
        ? [
            'From',
            Chain.fromChainId(action.fromToken.chainId)?.name?.toUpperCase(),
          ]
        : ['To', Chain.fromChainId(action.toToken.chainId)?.name?.toUpperCase()]

    return {
      fromToken:
        action.fromToken.address === zeroAddress
          ? Native.onChain(action.fromToken.chainId)
          : new Token(action.fromToken),
      toToken:
        action.toToken.address === zeroAddress
          ? Native.onChain(action.toToken.chainId)
          : new Token(action.toToken),
      label,
      chain,
    }
  }, [action.fromToken, action.toToken, chainId0])

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {label}: <span className="font-semibold">{chain}</span>
      </span>
      <div className="flex items-center justify-center gap-2 relative">
        <div className="rounded-full border border-accent">
          <Currency.Icon currency={fromToken} width={32} height={32} />
        </div>
        <div className="absolute z-[1] left-1/2 -translate-x-1/2 bg-background p-1 border border-accent rounded-full w-4 h-4">
          <ArrowsRightLeftIcon strokeWidth={3} className="text-blue" />
        </div>
        <div className="rounded-full border border-accent">
          <Currency.Icon currency={toToken} width={32} height={32} />
        </div>
      </div>
      <span className="text-sm font-semibold whitespace-nowrap">
        Swap {fromToken.symbol} to {toToken.symbol}
      </span>
    </div>
  )
}

const BridgeAction: FC<{
  action: CrossChainActionType
  toolDetails: CrossChainToolDetailsType
}> = ({ action, toolDetails }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
        Via{' '}
        <img
          src={toolDetails.logoURI}
          className="rounded-full"
          width={10}
          height={10}
          alt={toolDetails.name}
        />{' '}
        <span className="font-semibold">{toolDetails.name}</span>
      </span>
      <div className="flex justify-center">
        <div className="bg-background p-2 border border-accent rounded-full w-8 h-8">
          <ChevronDoubleRightIcon strokeWidth={3} className="text-blue" />
        </div>
      </div>
      <span className="text-sm font-semibold whitespace-nowrap">
        Bridge {action.fromToken.symbol}
      </span>
    </div>
  )
}
