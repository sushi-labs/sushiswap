import { Protocol } from '@sushiswap/database'
import { Select, SelectTrigger, SelectValue } from '@sushiswap/ui'
import { SelectContent } from '@sushiswap/ui'
import { SelectItem } from '@sushiswap/ui'
import { Switch } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui/components/tabsnew'
import React, { useState } from 'react'

import { PositionsTable } from './Tables'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'

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
  const [hide, setHide] = useState(true)

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
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
            {tab === 'v3' ? (
              <div className="flex gap-3 items-center px-2.5">
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Include closed</span>
                <Switch checked={hide} onCheckedChange={() => setHide((prev) => !prev)} />
              </div>
            ) : null}
          </div>
          <TabsContent value="v3">
            <ConcentratedPositionsTable
              hideClosed={hide}
              rowLink={(row) => `/pool/${row.chainId}:${row.address}?positionId=${row.tokenId}`}
            />
          </TabsContent>
          <TabsContent value="v2">
            <PositionsTable protocol={Protocol.SUSHISWAP_V2} rowLink={(row) => `/pool/${row.pool.id}`} />
          </TabsContent>
          <TabsContent value="stable">
            <PositionsTable protocol={Protocol.BENTOBOX_STABLE} rowLink={(row) => `/pool/${row.pool.id}`} />
          </TabsContent>
          <TabsContent value="classic">
            <PositionsTable protocol={Protocol.BENTOBOX_CLASSIC} rowLink={(row) => `/pool/${row.pool.id}`} />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
