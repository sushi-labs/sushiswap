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
import { type FC, useMemo, useState } from 'react'

import { BladeIcon } from '@sushiswap/ui/icons/BladeIcon'
import {
  type BladeChainId,
  type SushiSwapChainId,
  getEvmChainById,
  isBladeChainId,
  isSushiSwapChainId,
} from 'sushi/evm'
import { ConcentratedPositionsTable } from './ConcentratedPositionsTable/ConcentratedPositionsTable'
import { PositionsTable } from './PositionsTable'
import { BladePositionsTable } from './blade/BladePositionsTable'

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
]

export const PositionsTab: FC<{ chainId: SushiSwapChainId | BladeChainId }> = ({
  chainId,
}) => {
  const [tab, setTab] = useState('v3')
  const [hideClosedPositions, setHideClosedPositions] = useState(true)

  const items = useMemo(() => {
    if (isBladeChainId(chainId)) {
      return [
        ...ITEMS,
        {
          id: 'blade',
          value: 'blade',
          children: (
            <div className="flex items-center gap-2">
              <span>
                <BladeIcon className="h-3.5" />
              </span>
              <span>Blade</span>
            </div>
          ),
        },
      ]
    }
    return ITEMS
  }, [chainId])

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
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.children}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <TabsList className="hidden sm:inline-flex">
            {items.map((item) => (
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
            <div className="flex items-center gap-3 whitespace-nowrap">
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
        {isBladeChainId(chainId) && (
          <TabsContent value="blade">
            <BladePositionsTable chainId={chainId} />
          </TabsContent>
        )}
        <TabsContent value="v3">
          <ConcentratedPositionsTable
            chainId={chainId}
            hideNewPositionButton={true}
            hideClosedPositions={hideClosedPositions}
          />
        </TabsContent>
        <TabsContent value="v2">
          {isSushiSwapChainId(chainId) && (
            <PositionsTable
              chainId={chainId}
              rowLink={(row) =>
                `/${getEvmChainById(chainId).key}/pool/v2/${row.pool.address}/add`
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
