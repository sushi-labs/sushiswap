'use client'

import type { V2Pool } from '@sushiswap/graph-client/data-api'
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
import type { FC } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { AddSectionLegacy } from './AddSectionLegacy'
import { PoolPositionProvider } from './PoolPositionProvider'
import { RemoveSectionLegacy } from './RemoveSectionLegacy'

interface ManageV2LiquidityCardProps {
  pool: V2Pool
  tab?: 'add' | 'remove'
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({
  pool,
  tab = 'add',
}) => {
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
            <Link
              href={`/${getEvmChainById(pool.chainId).key}/pool/v2/${pool.address}/add`}
              className="flex flex-1"
            >
              <TabsTrigger
                testdata-id="add-tab"
                value="add"
                className="flex flex-1"
              >
                Add
              </TabsTrigger>
            </Link>
            <Link
              href={`/${getEvmChainById(pool.chainId).key}/pool/v2/${pool.address}/remove`}
              className="flex flex-1"
            >
              <TabsTrigger
                testdata-id="remove-tab"
                value="remove"
                className="flex flex-1"
              >
                Remove
              </TabsTrigger>
            </Link>
          </TabsList>
        </CardContent>
        <div className="px-6 pb-4">
          <Separator />
        </div>
        <PoolPositionProvider pool={pool}>
          <TabsContent value="add">
            <CardContent>
              <AddSectionLegacy pool={pool} />
            </CardContent>
          </TabsContent>
          <TabsContent value="remove">
            <CardContent>
              <RemoveSectionLegacy pool={pool} />
            </CardContent>
          </TabsContent>
        </PoolPositionProvider>
      </Tabs>
    </Card>
  )
}
