'use client'

import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { tryParseAmount } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Currency,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Reply,
  ReplyContent,
} from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

import { incentiveRewardToToken } from '../../../lib/functions'

interface SteerAPRHoverCardProps {
  children: ReactNode
  pool: Pool
  vault: Pool['steerVaults'][0]
}

export const SteerAPRHoverCard: FC<SteerAPRHoverCardProps> = ({ children, pool, vault }) => {
  const card = (
    <>
      <CardHeader>
        <CardTitle>{formatPercent(vault.apr1w + pool.incentiveApr)} </CardTitle>
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          {formatPercent(vault.apr1w)} fees {pool.isIncentivized ? `+ ${formatPercent(pool.incentiveApr)} rewards` : ''}
        </span>
        <CardDescription className="text-xs font-normal">
          Vault APR is calculated based on the vault fees over the last 7 days
          {pool.isIncentivized ? ', reward APR is based on the last 24 hours' : ''}.{' '}
          <b>The APR displayed is algorithmic and subject to change.</b>
        </CardDescription>
      </CardHeader>
      {pool.isIncentivized ? (
        <CardContent>
          <Reply>
            <ReplyContent>
              <p className="text-xs text-muted-foreground mb-1">Reward emissions (per day)</p>
              <ul className="list-disc space-y-1">
                {pool.incentives.map((el, i) => {
                  const amount = tryParseAmount(
                    el.rewardPerDay.toString(),
                    incentiveRewardToToken(el.chainId as ChainId, el)
                  )
                  if (!amount) return null

                  return (
                    <li key={el.pid} className="flex items-center gap-1">
                      <Currency.Icon currency={amount?.currency} width={12} height={12} />
                      {amount?.toSignificant(6)} {amount?.currency.symbol}
                    </li>
                  )
                })}
              </ul>
            </ReplyContent>
          </Reply>
        </CardContent>
      ) : null}
    </>
  )

  return (
    <>
      <div className="hidden sm:block">
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild>{children}</HoverCardTrigger>
          <HoverCardContent side="right" className="!p-0 max-w-[320px]">
            {card}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
            {children}
          </PopoverTrigger>
          <PopoverContent side="right" className="!p-0 max-w-[320px]">
            {card}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
