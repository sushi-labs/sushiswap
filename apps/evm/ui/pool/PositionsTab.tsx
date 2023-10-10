import { Protocol } from '@sushiswap/database'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import React, { useState } from 'react'

import { ConcentratedPositionsTable } from './ConcentratedPositionsTable'
import { PositionsTable } from './PositionsTable'

const ITEMS: { value: string; children: React.ReactNode }[] = [
  {
    value: 'v3',
    children: (
      <div className="flex items-center gap-2">
        <span>🍣</span>{' '}
        <span>
          SushiSwap <sup>v3</sup>
        </span>
      </div>
    ),
  },
  {
    value: 'v2',
    children: (
      <div className="flex items-center gap-2">
        <span>🍣</span>{' '}
        <span>
          SushiSwap <sup>v2</sup>
        </span>
      </div>
    ),
  },
  {
    value: 'stable',
    children: (
      <div className="flex items-center gap-2">
        <span>🍱</span>
        <span>Trident Stable</span>
      </div>
    ),
  },
  {
    value: 'classic',
    children: (
      <div className="flex items-center gap-2">
        <span>🍱</span>
        <span>Trident Classic</span>
      </div>
    ),
  },
]

export const PositionsTab = () => {
  const [tab, setTab] = useState('v3')

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={setTab} defaultValue="v3">
        <div className="flex justify-between mb-4">
          <div className="block sm:hidden">
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger>
                <SelectValue placeholder="Pool type" />
              </SelectTrigger>
              <SelectContent>
                {ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.children}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TabsList className="hidden sm:inline-flex">
            {ITEMS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.children}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="v3">
          <ConcentratedPositionsTable hideNewPositionButton={true} />
        </TabsContent>
        <TabsContent value="v2">
          <PositionsTable
            protocol={Protocol.SUSHISWAP_V2}
            rowLink={(row) => `/pool/${row.pool.id}`}
          />
        </TabsContent>
        <TabsContent value="stable">
          <PositionsTable
            protocol={Protocol.BENTOBOX_STABLE}
            rowLink={(row) => `/pool/${row.pool.id}`}
          />
        </TabsContent>
        <TabsContent value="classic">
          <PositionsTable
            protocol={Protocol.BENTOBOX_CLASSIC}
            rowLink={(row) => `/pool/${row.pool.id}`}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
