import { ArrowDownIcon } from '@heroicons/react/20/solid'
import { Pool } from '@sushiswap/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
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
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({ pool }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position by adding/removing liquidity</CardDescription>
      </CardHeader>
      <Tabs className="w-full" defaultValue="add">
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger value="add" className="flex flex-1">
              Add liquidity
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex flex-1">
              Remove liquidity
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <TabsContent value="add">
          <CardContent>
            <PoolPositionProvider pool={pool}>
              <PoolPositionStakedProvider pool={pool}>
                <PoolPositionRewardsProvider pool={pool}>
                  <div className="grid-cols-1 max-w-xl grid gap-4 pt-4">
                    {['BentoBox Classic', 'BentoBox Stable'].includes(pool.protocol) ? (
                      <AddSectionTrident pool={pool} />
                    ) : (
                      <AddSectionLegacy pool={pool} />
                    )}
                    <div className="flex justify-center py-2">
                      <ArrowDownIcon width={20} height={20} />
                    </div>
                    <AddSectionStake poolId={pool.id} />
                  </div>
                </PoolPositionRewardsProvider>
              </PoolPositionStakedProvider>
            </PoolPositionProvider>
          </CardContent>
        </TabsContent>
        <TabsContent value="remove">
          <CardContent>
            <PoolPositionProvider pool={pool}>
              <PoolPositionStakedProvider pool={pool}>
                <PoolPositionRewardsProvider pool={pool}>
                  <div className="grid-cols-1 max-w-xl grid gap-4 pt-4">
                    <RemoveSectionUnstake poolId={pool.id} />
                    <div className="flex justify-center py-2">
                      <ArrowDownIcon fill="currentColor" width={20} height={20} className="text-muted-foreground" />
                    </div>
                    {['BentoBox Classic', 'BentoBox Stable'].includes(pool.protocol) ? (
                      <RemoveSectionTrident pool={pool} />
                    ) : (
                      <RemoveSectionLegacy pool={pool} />
                    )}
                  </div>
                </PoolPositionRewardsProvider>
              </PoolPositionStakedProvider>
            </PoolPositionProvider>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
