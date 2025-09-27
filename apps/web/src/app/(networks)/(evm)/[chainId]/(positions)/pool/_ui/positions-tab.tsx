'use client'

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
import React, { type FC, useMemo, useState } from 'react'

import { BladeIcon } from '@sushiswap/ui/icons/BladeIcon'
import {
  type BladeChainId,
  type SushiSwapChainId,
  SushiSwapProtocol,
  getEvmChainById,
  isBladeChainId,
  isSushiSwapChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { ConcentratedPositionsTable } from '~evm/[chainId]/pool/_ui/ConcentratedPositionsTable/concentrated-positions-table'
import { BladePositionsTable } from './blade-positions-table'
import { PositionsTable } from './positions-table'

type TabItem = {
  id: string
  value: string
  protocol: SushiSwapProtocol
  children: React.ReactNode
  disabled: boolean
}

const createItems = (
  chainId: SushiSwapChainId | BladeChainId,
  supportedProtocols: SushiSwapProtocol[],
): TabItem[] => {
  const allItems: TabItem[] = [
    {
      id: 'sushiswap-v3',
      value: 'v3',
      protocol: SushiSwapProtocol.SUSHISWAP_V3,
      disabled: !isSushiSwapV3ChainId(chainId),
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
      protocol: SushiSwapProtocol.SUSHISWAP_V2,
      disabled: !isSushiSwapV2ChainId(chainId),
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
      id: 'blade',
      value: 'blade',
      protocol: SushiSwapProtocol.BLADE,
      disabled: false, // Blade is only included if supported, so never disabled
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

  // Filter items based on supported protocols
  return allItems.filter((item) => supportedProtocols.includes(item.protocol))
}

export const PositionsTab: FC<{
  chainId: SushiSwapChainId | BladeChainId
  supportedProtocols: SushiSwapProtocol[]
}> = ({ chainId, supportedProtocols }) => {
  const items = useMemo(
    () => createItems(chainId, supportedProtocols),
    [chainId, supportedProtocols],
  )

  // Find the first non-disabled tab as default
  const defaultTab = useMemo(() => {
    const firstAvailable = items.find((item) => !item.disabled)
    return firstAvailable?.value || 'v3'
  }, [items])

  const [tab, setTab] = useState(defaultTab)
  const [hideClosedPositions, setHideClosedPositions] = useState(true)

  // Update tab if current selection becomes disabled
  React.useEffect(() => {
    const currentItem = items.find((item) => item.value === tab)
    if (currentItem?.disabled) {
      setTab(defaultTab)
    }
  }, [tab, items, defaultTab])

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={setTab} defaultValue={defaultTab}>
        <div className="flex justify-between mb-4">
          <div className="block sm:hidden">
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger>
                <SelectValue placeholder="Pool type" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
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
                disabled={item.disabled}
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
