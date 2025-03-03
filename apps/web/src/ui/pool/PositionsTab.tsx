import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import type React from 'react'
import { type FC, useState } from 'react'

import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { ChainKey } from 'sushi/chain'
import type { SushiSwapChainId } from 'sushi/config'
import { ConcentratedPositionsTable } from './ConcentratedPositionsTable/ConcentratedPositionsTable'
import { PositionsTable } from './PositionsTable'
import { SmartPositionsTable } from './SmartPositionsTable'

const ITEMS: { id: string; value: string; children: React.ReactNode }[] = [
  {
    id: 'sushiswap-v3',
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
    id: 'sushiswap-v2',
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
    id: 'sushiswap-smart',
    value: 'smart',
    children: (
      <div className="flex items-center gap-2">
        <span>💡</span>
        <span>Smart Pool</span>
      </div>
    ),
  },
]

export const PositionsTab: FC<{ chainId: SushiSwapChainId }> = ({
  chainId,
}) => {
  const [tab, setTab] = useState('v3')
  const [hideClosedPositions, setHideClosedPositions] = useState(true)
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
              <TabsTrigger
                key={item.value}
                value={item.value}
                testdata-id={item.id}
              >
                {item.children}
              </TabsTrigger>
            ))}
          </TabsList>
          {tab === 'v3' ? (
            <div className="flex gap-3 items-center whitespace-nowrap">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Hide closed
              </span>
              <Switch
                checked={hideClosedPositions}
                onCheckedChange={() => setHideClosedPositions((prev) => !prev)}
              />
            </div>
          ) : null}
        </div>
        <TabsContent value="v3">
          <ConcentratedPositionsTable
            chainId={chainId}
            hideNewPositionButton={true}
            hideClosedPositions={hideClosedPositions}
          />
        </TabsContent>
        <TabsContent value="v2">
          <PositionsTable
            chainId={chainId}
            rowLink={(row) =>
              `/${ChainKey[chainId]}/pool/v2/${row.pool.address}/add`
            }
          />
        </TabsContent>
        {isSmartPoolChainId(chainId) ? (
          <TabsContent value="smart">
            <SmartPositionsTable chainId={chainId} />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}
