'use client'

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

import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import { getEvmChainById } from 'sushi/evm'
import { BladeAddSection } from './add-liquidity/blade-add-section'
import { BladeRemoveSection } from './remove-liquidity/blade-remove-section'

interface ManageBladeLiquidityCardProps {
  pool: BladePool
  tab?: 'add' | 'remove'
}

export const ManageBladeLiquidityCard: FC<ManageBladeLiquidityCardProps> = ({
  pool,
  tab = 'add',
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>Manage your position</CardDescription>
      </CardHeader>
      <Tabs value={tab} className="w-full" defaultValue={tab}>
        <CardContent>
          <TabsList className="!flex">
            <Link
              href={`/${getEvmChainById(pool.chainId).key}/pool/blade/${pool.address}/add`}
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
              href={`/${getEvmChainById(pool.chainId).key}/pool/blade/${pool.address}/remove`}
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
        <TabsContent value="add">
          <CardContent>
            <BladeAddSection pool={pool} />
          </CardContent>
        </TabsContent>
        <TabsContent value="remove">
          <CardContent>
            <BladeRemoveSection pool={pool} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
