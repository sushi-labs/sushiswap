'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardLabel,
  CardTitle,
} from '@sushiswap/ui'
import type { FC } from 'react'
import { incentiveRewardToToken } from 'src/lib/functions'
import { tryParseAmount } from 'sushi/currency'
import { CardCurrencyAmountItem } from './PoolComposition'

export const PoolRewards: FC<{ pool: V2Pool }> = ({ pool }) => {
  const incentives = pool.incentives.filter(
    (incentive) => incentive.rewardPerDay > 0,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards</CardTitle>
        <CardDescription>
          Distributed to everyone who provides liquidity to this pool. <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens (per day)</CardLabel>
          {incentives.map((incentive, index) => {
            const amount = tryParseAmount(
              incentive.rewardPerDay.toString(),
              incentiveRewardToToken(pool.chainId, incentive),
            )

            return (
              <CardCurrencyAmountItem
                key={index}
                amount={amount?.toSignificant(6)}
                currency={{
                  logoUrl:
                    'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64/d_unknown.png/tokens/1/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2.jpg',
                  symbol: 'SUSHI',
                }}
              />
            )
          })}
        </CardGroup>
      </CardContent>
    </Card>
  )
}
