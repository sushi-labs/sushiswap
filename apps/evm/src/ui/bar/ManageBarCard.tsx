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
import { StakeSection } from './StakeSection'
import { UnstakeSection } from './UnstakeSection'

export const ManageBarCard = ({
  tab = 'stake',
}: { tab?: 'stake' | 'unstake' }) => {
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
        onValueChange={() => {}}
        className="w-full"
        defaultValue={tab}
      >
        <CardContent>
          <TabsList className="!flex">
            <Link href={'/bar/stake'} className="flex flex-1" shallow>
              <TabsTrigger
                testdata-id="stake-tab"
                value="stake"
                className="flex flex-1"
              >
                Stake
              </TabsTrigger>
            </Link>
            <Link href={'/bar/unstake'} className="flex flex-1" shallow>
              <TabsTrigger
                testdata-id="unstake-tab"
                value="unstake"
                className="flex flex-1"
              >
                Unstake
              </TabsTrigger>
            </Link>
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
