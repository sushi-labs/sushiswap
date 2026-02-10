'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { Button, Currency, LinkExternal, SkeletonText } from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import React from 'react'
import { formatPercent, shortenAddress } from 'sushi'
import { EvmChainId, XSUSHI, getEvmChainById } from 'sushi/evm'
import { useSushiBar } from './sushi-bar-provider'

export const BarHeader = () => {
  const { apy, isLoading } = useSushiBar()

  return (
    <div className="flex flex-col gap-6">
      <span className="gap-3 flex">
        <Currency.Icon
          currency={XSUSHI[EvmChainId.ETHEREUM]}
          width={52}
          height={52}
        />
        <span className="text-5xl font-bold bg-gradient-to-r from-[#FE5A75] to-[#FEC464] text-transparent bg-clip-text">
          Sushi Bar
        </span>
      </span>
      <span className="text-xl max-w-[720px] text-muted-foreground">
        For every swap on Sushi, a portion of the swap fee is locked into the
        liquidity pool awaiting to be served to xSUSHI holders.
      </span>
      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground">
        <div className="flex items-center gap-1.5">
          <span className="tracking-tighter font-semibold whitespace-nowrap">
            APY (1m)
          </span>
          {isLoading ? (
            <SkeletonText className="w-12" fontSize="default" />
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <span className="underline decoration-dotted underline-offset-2">
                    {formatPercent(apy)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  The APY displayed is algorithmic and subject to change.
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
            href={getEvmChainById(EvmChainId.ETHEREUM).getTokenUrl(
              XSUSHI[EvmChainId.ETHEREUM].address,
            )}
          >
            <Button
              asChild
              variant="link"
              size="sm"
              className="!font-medium !text-secondary-foreground"
            >
              {shortenAddress(XSUSHI[EvmChainId.ETHEREUM].address, 4)}
              <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            </Button>
          </LinkExternal>
        </div>
      </div>
      <div>
        <LinkExternal href="https://www.sushi.com/blog/sushi-bar-faq">
          <Button asChild icon={ArrowTopRightOnSquareIcon}>
            Learn More
          </Button>
        </LinkExternal>
      </div>
    </div>
  )
}
