'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, Currency, LinkExternal, SkeletonText } from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui/components/tooltip'
import React from 'react'
import { Chain, ChainId } from 'sushi/chain'
import { XSUSHI } from 'sushi/currency'
import { formatPercent, shortenAddress } from 'sushi/format'
import { useSushiBar } from './SushiBarProvider'

export const BarHeader = () => {
  const { apr, isLoading } = useSushiBar()

  return (
    <div className="flex flex-col gap-6">
      <span className="gap-3 flex">
        <Currency.Icon
          currency={XSUSHI[ChainId.ETHEREUM]}
          width={52}
          height={52}
        />
        <span className="text-5xl font-bold bg-gradient-to-r from-[#FE5A75] to-[#FEC464] text-transparent bg-clip-text">
          Sushi Bar
        </span>
      </span>
      <span className="text-xl max-w-[720px] text-muted-foreground">
        For every swap on Sushi, a 0.05% of the swap fee is locked into the
        liquidity pool awaiting to be served to xSUSHI holders.
      </span>
      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground">
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">APR</span>
          {isLoading ? (
            <SkeletonText className="w-12" fontSize="default" />
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span className="underline decoration-dotted underline-offset-2">
                    {formatPercent(apr)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  The APR displayed is algorithmic and subject to change.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">Network</span>
          Ethereum
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold">XSUSHI</span>
          <LinkExternal
            href={Chain.from(ChainId.ETHEREUM)?.getTokenUrl(
              XSUSHI[ChainId.ETHEREUM].address,
            )}
          >
            <Button
              asChild
              variant="link"
              size="sm"
              className="!font-medium !text-secondary-foreground"
            >
              {shortenAddress(XSUSHI[ChainId.ETHEREUM].address, 4)}
              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </Button>
          </LinkExternal>
        </div>
      </div>
    </div>
  )
}
