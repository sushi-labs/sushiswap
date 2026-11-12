'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardContent,
  LinkExternal,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useState } from 'react'
import { StakeSection } from './stake-section'
import { UnstakeSection } from './unstake-section'

export const ManageBarCard = () => {
  const [tab, setTab] = useState<'stake' | 'unstake'>('stake')
  return (
    <Card>
      <CardContent className="!pt-6 !gap-2 !pb-3">
        <h3 className="text-xl font-medium">Manage stake</h3>
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab as 'stake' | 'unstake')}
          className="w-full"
          defaultValue={tab}
        >
          <TabsList className="!flex">
            <TabsTrigger
              testdata-id="stake-tab"
              value="stake"
              className="flex-1"
            >
              Stake
            </TabsTrigger>
            <TabsTrigger
              testdata-id="unstake-tab"
              value="unstake"
              className="flex-1"
            >
              Unstake
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stake">
            <StakeSection />
          </TabsContent>
          <TabsContent value="unstake">
            <UnstakeSection />
          </TabsContent>
        </Tabs>
        <LinkExternal href="https://etherscan.io/token/0x8798249c2e607446efb7ad49ec89dd1865ff4272">
          <Button
            variant="ghost"
            size="xs"
            asChild
            icon={ArrowTopRightOnSquareIcon}
            iconPosition="end"
            iconProps={{
              className: '!w-3 !h-3',
            }}
            className="!text-muted-foreground"
          >
            xSUSHI contract
          </Button>
        </LinkExternal>
      </CardContent>
    </Card>
  )
}
