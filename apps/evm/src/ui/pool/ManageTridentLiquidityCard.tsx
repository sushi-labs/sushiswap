'use client'

import { Pool } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Message,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

import { AddSectionStake } from './AddSectionStake'
import { PoolPositionProvider } from './PoolPositionProvider'
import { PoolPositionRewardsProvider } from './PoolPositionRewardsProvider'
import { PoolPositionStakedProvider } from './PoolPositionStakedProvider'
import { RemoveSectionTrident } from './RemoveSectionTrident'
import { RemoveSectionUnstake } from './RemoveSectionUnstake'

interface ManageTridentLiquidityCard {
  pool: Pool
  tab?: 'stake' | 'unstake' | 'add' | 'remove'
}

export const ManageTridentLiquidityCard: FC<ManageTridentLiquidityCard> = ({
  pool,
  tab = 'remove',
}) => {
  const isFarm = pool.wasIncentivized || pool.isIncentivized

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position</CardDescription>
      </CardHeader>
      <Tabs
        value={tab}
        onValueChange={() => {}}
        className="w-full"
        defaultValue={tab}
      >
        <CardContent>
          <TabsList className="!flex">
            <Link href={`/pool/${pool.id}/remove`} className="flex flex-1">
              <TabsTrigger
                testdata-id="remove-tab"
                value="remove"
                className="flex flex-1"
              >
                Remove
              </TabsTrigger>
            </Link>
            {isFarm ? (
              <Link href={`/pool/${pool.id}/stake`} className="flex flex-1">
                <TabsTrigger
                  testdata-id="stake-tab"
                  value="stake"
                  className="flex flex-1"
                >
                  Stake
                </TabsTrigger>
              </Link>
            ) : (
              <TabsTrigger
                testdata-id="stake-tab"
                disabled
                value="stake"
                className="flex flex-1"
              >
                Stake
              </TabsTrigger>
            )}
            {isFarm ? (
              <Link href={`/pool/${pool.id}/unstake`} className="flex flex-1">
                <TabsTrigger
                  testdata-id="unstake-tab"
                  value="unstake"
                  className="flex flex-1"
                >
                  Unstake
                </TabsTrigger>
              </Link>
            ) : (
              <TabsTrigger
                testdata-id="unstake-tab"
                disabled
                value="unstake"
                className="flex flex-1"
              >
                Unstake
              </TabsTrigger>
            )}
          </TabsList>
        </CardContent>
        <div className="px-6 pb-4">
          <Separator />
        </div>
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <TabsContent value="remove">
                <CardContent>
                  <RemoveSectionTrident pool={pool} />
                </CardContent>
              </TabsContent>
              <TabsContent value="stake">
                <CardContent>
                  {isFarm ? (
                    <AddSectionStake poolId={pool.id} />
                  ) : (
                    <Message
                      variant="warning"
                      size="sm"
                      className="text-center"
                    >
                      No farms available for this pool
                    </Message>
                  )}
                </CardContent>
              </TabsContent>
              <TabsContent value="unstake">
                <CardContent>
                  {isFarm ? (
                    <RemoveSectionUnstake poolId={pool.id} />
                  ) : (
                    <Message
                      variant="warning"
                      size="sm"
                      className="text-center"
                    >
                      No farms available for this pool
                    </Message>
                  )}
                </CardContent>
              </TabsContent>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </Tabs>
    </Card>
  )
}
