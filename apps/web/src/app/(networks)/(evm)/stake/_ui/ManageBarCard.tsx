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
import { useState } from 'react'
import { StakeSection } from './StakeSection'
import { UnstakeSection } from './UnstakeSection'

export const ManageBarCard = () => {
  const [tab, setTab] = useState<'stake' | 'unstake'>('stake')
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage</CardTitle>
        <CardDescription>
          Manage your position in the Sushi Bar.
        </CardDescription>
      </CardHeader>
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab as 'stake' | 'unstake')}
        className="w-full"
        defaultValue={tab}
      >
        <CardContent>
          <TabsList className="!flex">
            <TabsTrigger
              testdata-id="stake-tab"
              value="stake"
              className="flex flex-1"
            >
              Stake
            </TabsTrigger>
            <TabsTrigger
              testdata-id="unstake-tab"
              value="unstake"
              className="flex flex-1"
            >
              Unstake
            </TabsTrigger>
          </TabsList>
        </CardContent>
        <div className="px-6 pb-4">
          <Separator />
        </div>
        <TabsContent value="stake">
          <CardContent>
            <StakeSection />
          </CardContent>
        </TabsContent>
        <TabsContent value="unstake">
          <CardContent>
            <UnstakeSection />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
