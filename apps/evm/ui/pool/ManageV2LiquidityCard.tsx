'use client'

import { Pool, Protocol } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import Link from 'next/link'
import { FC } from 'react'

import { AddSectionLegacy } from './AddSectionLegacy'
import { AddSectionStake } from './AddSectionStake'
import { AddSectionTrident } from './AddSectionTrident'
import { PoolPositionProvider } from './PoolPositionProvider'
import { PoolPositionRewardsProvider } from './PoolPositionRewardsProvider'
import { PoolPositionStakedProvider } from './PoolPositionStakedProvider'
import { RemoveSectionLegacy } from './RemoveSectionLegacy'
import { RemoveSectionTrident } from './RemoveSectionTrident'
import { RemoveSectionUnstake } from './RemoveSectionUnstake'

interface ManageV2LiquidityCardProps {
  pool: Pool
  tab?: 'stake' | 'unstake' | 'add' | 'remove'
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({ pool, tab = 'add' }) => {
  const isFarm = pool.wasIncentivized || pool.isIncentivized
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position</CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue={tab}>
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger asChild testdata-id="add-tab" value="add" className="flex flex-1">
              <Link href={`/pool/${pool.id}/add`}>Add</Link>
            </TabsTrigger>
            <TabsTrigger asChild testdata-id="remove-tab" value="remove" className="flex flex-1">
              <Link href={`/pool/${pool.id}/remove`}>Remove</Link>
            </TabsTrigger>
            <TabsTrigger asChild testdata-id="stake-tab" disabled={!isFarm} value="stake" className="flex flex-1">
              <Link href={`/pool/${pool.id}/stake`}>Stake</Link>
            </TabsTrigger>
            <TabsTrigger asChild testdata-id="unstake-tab" disabled={!isFarm} value="unstake" className="flex flex-1">
              <Link href={`/pool/${pool.id}/unstake`}>Unstake</Link>
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <div className="pb-4 px-6">
          <Separator />
        </div>
        <PoolPositionProvider pool={pool}>
          <PoolPositionStakedProvider pool={pool}>
            <PoolPositionRewardsProvider pool={pool}>
              <TabsContent value="add">
                <CardContent>
                  {pool.protocol === Protocol.BENTOBOX_CLASSIC || pool.protocol === Protocol.BENTOBOX_STABLE ? (
                    <AddSectionTrident pool={pool} />
                  ) : null}
                  {pool.protocol === Protocol.SUSHISWAP_V2 ? <AddSectionLegacy pool={pool} /> : null}
                </CardContent>
              </TabsContent>
              <TabsContent value="remove">
                <CardContent>
                  {pool.protocol === Protocol.BENTOBOX_CLASSIC || pool.protocol === Protocol.BENTOBOX_STABLE ? (
                    <RemoveSectionTrident pool={pool} />
                  ) : null}
                  {pool.protocol === Protocol.SUSHISWAP_V2 ? <RemoveSectionLegacy pool={pool} /> : null}
                </CardContent>
              </TabsContent>
              <TabsContent value="stake">
                <CardContent>
                  <AddSectionStake poolId={pool.id} />
                </CardContent>
              </TabsContent>
              <TabsContent value="unstake">
                <CardContent>
                  <RemoveSectionUnstake poolId={pool.id} />
                </CardContent>
              </TabsContent>
            </PoolPositionRewardsProvider>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      </Tabs>
    </Card>
  )
}
