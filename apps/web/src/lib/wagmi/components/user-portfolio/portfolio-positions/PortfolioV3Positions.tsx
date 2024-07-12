import { PortfolioV3Position } from '@sushiswap/graph-client/data-api'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Currency,
  classNames,
} from '@sushiswap/ui'
import { BagIcon } from '@sushiswap/ui/icons/BagIcon'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { FC } from 'react'
import { formatUSD } from 'sushi/format'

interface PortfolioV3PositionsProps {
  positions: PortfolioV3Position[]
}

export const PortfolioV3Positions: FC<PortfolioV3PositionsProps> = ({
  positions,
}) => (
  <AccordionItem value="v3" className="!border-0">
    <AccordionTrigger className="px-5 underline-offset-2">
      {`V3 Positions (${positions.length})`}
    </AccordionTrigger>
    <AccordionContent className="cursor-default">
      {positions.map((position) => (
        <div
          id={`${position.chainId}:${position.id}`}
          className="flex justify-between items-center hover:bg-muted px-5 py-3 gap-x-4"
        >
          <div className="flex gap-x-4 items-center whitespace-nowrap overflow-hidden">
            <div className="shrink-0">
              <Badge
                className="border-1 border-background bg-background rounded-full z-[11] right-[-0.225rem] bottom-[-0.225rem]"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon
                    chainId={position.chainId}
                    width={14}
                    height={14}
                  />
                }
              >
                <Currency.IconList iconWidth={28} iconHeight={28}>
                  <img
                    className="rounded-full"
                    src={position.token0.logoUrl}
                    alt={position.token0.symbol}
                  />
                  <img
                    className="rounded-full"
                    src={position.token1.logoUrl}
                    alt={position.token1.symbol}
                  />
                </Currency.IconList>
              </Badge>
            </div>
            <div className="overflow-hidden flex flex-col gap-y-1">
              <div className="text-sm font-medium overflow-ellipsis overflow-hidden">
                {position.name}
              </div>
              <div className="flex items-center gap-x-1">
                <div className="text-muted-foreground text-xs">{`V3-${
                  position.swapFee * 100
                }%`}</div>
                <div
                  className={classNames(
                    position.range === 'OUT_OF_RANGE'
                      ? 'bg-yellow/10'
                      : position.range === 'IN_RANGE'
                        ? 'bg-green/10'
                        : 'bg-muted-foreground',
                    'px-2 py-1 flex items-center gap-1 rounded-full',
                  )}
                >
                  <div
                    className={classNames(
                      position.range === 'OUT_OF_RANGE'
                        ? 'bg-yellow'
                        : position.range === 'IN_RANGE'
                          ? 'bg-green'
                          : 'bg-muted-foreground/10',
                      'w-3 h-3 rounded-full',
                    )}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {position.range === 'OUT_OF_RANGE'
                      ? 'Out of Range'
                      : position.range === 'IN_RANGE'
                        ? 'In Range'
                        : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <div className="text-sm font-medium text-right">
              {formatUSD(position.amountUSD)}
            </div>
            <div className="flex gap-x-0.5 items-center justify-end text-xs text-muted-foreground">
              <BagIcon width={10} height={9} />
              {formatUSD(
                position.fees.reduce((sum, fee) => sum + fee.amountUSD, 0),
              )}
            </div>
          </div>
        </div>
      ))}
    </AccordionContent>
  </AccordionItem>
)
