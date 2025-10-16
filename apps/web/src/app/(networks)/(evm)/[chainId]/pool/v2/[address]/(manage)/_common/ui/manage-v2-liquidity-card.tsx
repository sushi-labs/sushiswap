'use client'

import {
  type RawV2Pool,
  type V2Pool,
  hydrateV2Pool,
} from '@sushiswap/graph-client/data-api'
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
import { type FC, useMemo } from 'react'
import { getEvmChainById } from 'sushi/evm'
import { PoolPositionProvider } from '../../../_common/ui/pool-position-provider'
import { AddSectionLegacy } from './add-section-legacy'
import { RemoveSectionLegacy } from './remove-section-legacy'

interface ManageV2LiquidityCardProps {
  pool: RawV2Pool
  tab?: 'add' | 'remove'
}

export const ManageV2LiquidityCard: FC<ManageV2LiquidityCardProps> = ({
  pool: rawPool,
  tab = 'add',
}) => {
  const pool = useMemo(() => hydrateV2Pool(rawPool), [rawPool])

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
