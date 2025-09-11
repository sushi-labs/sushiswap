import {
  Card,
  CardContent,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import { formatNumber, formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/evm'

interface CrossChainSwapFeesHoverCardProps {
  feesBreakdown: FeesBreakdown
  gasFeesUSD: number
  protocolFeesUSD: number
  chainId0: EvmChainId
  chainId1: EvmChainId
  children: React.ReactNode
}

export const CrossChainSwapFeesHoverCard: FC<
  CrossChainSwapFeesHoverCardProps
> = ({ feesBreakdown, chainId0, chainId1, children }) => {
  const content = useMemo(() => {
    return (
      <Card>
        <CardContent className="!p-3 !gap-3">
          {feesBreakdown.gas.size > 0 ? (
            <div className="flex justify-between gap-6">
              <span className="font-normal">Network Fees</span>
              <div className="flex flex-col gap-1">
                {feesBreakdown.gas.get(chainId0) ? (
                  <span>
                    <span className="text-primary">
                      {formatNumber(
                        feesBreakdown.gas.get(chainId0)!.amount.toString(),
                      )}{' '}
                      {feesBreakdown.gas.get(chainId0)!.amount.currency.symbol}
                    </span>{' '}
                    ({formatUSD(feesBreakdown.gas.get(chainId0)!.amountUSD)})
                  </span>
                ) : null}
                {feesBreakdown.gas.get(chainId1) ? (
                  <span>
                    <span className="text-primary">
                      {formatNumber(
                        feesBreakdown.gas.get(chainId1)!.amount.toString(),
                      )}{' '}
                      {feesBreakdown.gas.get(chainId1)!.amount.currency.symbol}
                    </span>{' '}
                    ({formatUSD(feesBreakdown.gas.get(chainId1)!.amountUSD)})
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
          {feesBreakdown.protocol.size > 0 ? (
            <div className="flex justify-between gap-6">
              <span className="font-normal">Protocol Fees</span>
              <div className="flex flex-col gap-1">
                {feesBreakdown.protocol.get(chainId0) ? (
                  <span>
                    <span className="text-primary">
                      {formatNumber(
                        feesBreakdown.protocol.get(chainId0)!.amount.toString(),
                      )}{' '}
                      {
                        feesBreakdown.protocol.get(chainId0)!.amount.currency
                          .symbol
                      }
                    </span>{' '}
                    (
                    {formatUSD(feesBreakdown.protocol.get(chainId0)!.amountUSD)}
                    )
                  </span>
                ) : null}
                {feesBreakdown.protocol.get(chainId1) ? (
                  <span>
                    <span className="text-primary">
                      {formatNumber(
                        feesBreakdown.protocol.get(chainId1)!.amount.toString(),
                      )}{' '}
                      {
                        feesBreakdown.protocol.get(chainId1)!.amount.currency
                          .symbol
                      }
                    </span>{' '}
                    (
                    {formatUSD(feesBreakdown.protocol.get(chainId1)!.amountUSD)}
                    )
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }, [feesBreakdown, chainId0, chainId1])

  return (
    <>
      <div className="hidden sm:block">
        <HoverCard openDelay={300} closeDelay={0}>
          <HoverCardTrigger asChild>{children}</HoverCardTrigger>
          <HoverCardContent side="right" className="!p-0 max-w-[320px]">
            {content}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
            {children}
          </PopoverTrigger>
          <PopoverContent side="right" className="!p-0 max-w-[320px]">
            {content}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
