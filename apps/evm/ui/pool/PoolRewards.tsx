'use client'

import { ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { tryParseAmount } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import {
  CardContent,
  CardCurrencyAmountItem,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { Card, CardDescription } from '@sushiswap/ui/components/card'
import { incentiveRewardToToken } from 'lib/functions'
import React, { FC } from 'react'

export const PoolRewards: FC<{ pool: Pool }> = ({ pool }) => {
  const incentives = pool.incentives.filter((incentive) => incentive.rewardPerDay > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted">
                  APR: {pool.incentiveApr > 0 ? formatPercent(pool.incentiveApr) : 'n/a'}
                </span>
              </TooltipTrigger>
              <TooltipContent>The APR displayed is algorithmic and subject to change.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens (per day)</CardLabel>
          {incentives.map((incentive, index) => {
            const amount = tryParseAmount(
              incentive.rewardPerDay.toString(),
              incentiveRewardToToken(pool.chainId as ChainId, incentive)
            )
            return <CardCurrencyAmountItem key={index} amount={amount} />
          })}
        </CardGroup>
      </CardContent>
    </Card>
  )
}
