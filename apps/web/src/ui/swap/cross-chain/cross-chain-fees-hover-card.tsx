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
import { FC, useMemo } from 'react'
import { FeesBreakdown } from 'src/lib/swap/cross-chain'
import { ChainId } from 'sushi/chain'
import { formatUSD } from 'sushi/format'

interface CrossChainFeesHoverCardProps {
  feesBreakdown: FeesBreakdown
  gasFeesUSD: number
  protocolFeesUSD: number
  chainId0: ChainId
  chainId1: ChainId
  children: React.ReactNode
}

export const CrossChainFeesHoverCard: FC<CrossChainFeesHoverCardProps> = ({
  feesBreakdown,
  gasFeesUSD,
  protocolFeesUSD,
  chainId0,
  chainId1,
  children,
}) => {
  const content = useMemo(() => {
    return (
      <Card>
        <CardContent className="!p-3 font-medium ">
          {feesBreakdown.gas.size > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-6">
                <span>Network Fees</span>
                <span className="text-primary">{formatUSD(gasFeesUSD)}</span>
              </div>
              {feesBreakdown.gas.get(chainId0) ? (
                <div className="flex justify-between gap-6">
                  <span>Origin Chain</span>
                  <span>
                    {feesBreakdown.gas.get(chainId0)!.amount.toSignificant(4)}{' '}
                    {feesBreakdown.gas.get(chainId0)!.amount.currency.symbol}
                  </span>
                </div>
              ) : null}
              {feesBreakdown.gas.get(chainId1) ? (
                <div className="flex justify-between gap-6">
                  <span>Dest. Chain</span>
                  <span>
                    {feesBreakdown.gas.get(chainId1)!.amount.toSignificant(4)}{' '}
                    {feesBreakdown.gas.get(chainId1)!.amount.currency.symbol}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
          {feesBreakdown.protocol.size > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-6">
                <span>Protocol Fees</span>
                <span className="text-primary">
                  {formatUSD(protocolFeesUSD)}
                </span>
              </div>
              {feesBreakdown.protocol.get(chainId0) ? (
                <div className="flex justify-between gap-6">
                  <span>Origin Chain</span>
                  <span>
                    {feesBreakdown.protocol
                      .get(chainId0)!
                      .amount.toSignificant(4)}{' '}
                    {
                      feesBreakdown.protocol.get(chainId0)!.amount.currency
                        .symbol
                    }
                  </span>
                </div>
              ) : null}
              {feesBreakdown.protocol.get(chainId1) ? (
                <div className="flex justify-between gap-6">
                  <span>Dest. Chain</span>
                  <span>
                    {feesBreakdown.protocol
                      .get(chainId1)!
                      .amount.toSignificant(4)}{' '}
                    {
                      feesBreakdown.protocol.get(chainId1)!.amount.currency
                        .symbol
                    }
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }, [feesBreakdown, chainId0, chainId1, gasFeesUSD, protocolFeesUSD])

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
