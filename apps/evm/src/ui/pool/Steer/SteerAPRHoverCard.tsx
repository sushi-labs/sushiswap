'use client'

import { Pool } from '@sushiswap/client'
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
import { ChainId } from 'sushi/chain'
import { tryParseAmount } from 'sushi/currency'
import { formatPercent } from 'sushi/format'

import { incentiveRewardToToken } from '../../../lib/functions'

interface SteerAPRHoverCardProps {
  children: ReactNode
  pool: Pool
  vault: Pool['steerVaults'][0]
}

export const SteerAPRHoverCard: FC<SteerAPRHoverCardProps> = ({
  children,
  pool,
  vault,
}) => {
  const card = (
    <>
      <CardHeader>
        <CardTitle>
          {formatPercent(vault.apr1w + pool.incentiveApr)}{' '}
          {pool.isIncentivized && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {formatPercent(vault.apr1w)} fees{' '}
              {`+ ${formatPercent(pool.incentiveApr)} rewards`}
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-xs font-normal">
          Vault APR is calculated based on the vault fees over the last 7 days.
          <br />
          {pool.isIncentivized
            ? 'Reward APR is based on the last 24 hours.'
            : ''}
        </CardDescription>
      </CardHeader>
      {pool.isIncentivized ? (
        <CardContent>
          <Reply>
            <ReplyContent>
              <p className="text-xs text-muted-foreground mb-1">
                Reward emissions (per day)
              </p>
              <ul className="list-disc space-y-1">
                {pool.incentives.map((el) => {
                  const amount = tryParseAmount(
                    el.rewardPerDay.toString(),
                    incentiveRewardToToken(el.chainId as ChainId, el),
                  )
                  if (!amount) return null

                  return (
                    <li key={el.pid} className="flex items-center gap-1">
                      <Currency.Icon
                        currency={amount?.currency}
                        width={12}
                        height={12}
                      />
                      {amount?.toSignificant(6)} {amount?.currency.symbol}
                    </li>
                  )
                })}
              </ul>
            </ReplyContent>
          </Reply>
          <span className="text-xs text-muted-foreground">
            The APR displayed is algorithmic and subject to change.
          </span>
        </CardContent>
      ) : null}
    </>
  )

  return (
    <>
      <div className="hidden sm:block">
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger>{children}</HoverCardTrigger>
          <HoverCardContent side="left" className="!p-0 max-w-fit">
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
