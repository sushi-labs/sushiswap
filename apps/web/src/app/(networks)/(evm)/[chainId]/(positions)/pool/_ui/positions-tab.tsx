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
import type React from 'react'
import { type FC, useMemo, useState } from 'react'

import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { BladeIcon } from '@sushiswap/ui/icons/BladeIcon'
import { useSearchParams } from 'next/navigation'
import { SteerSmartPositionsTable } from 'src/lib/steer/components/steer-smart-positions-table'
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
import { BladeSunsetNotice } from '~evm/[chainId]/_ui/blade-sunset-notice'
import { V2MigrationNotice } from '~evm/[chainId]/_ui/v2-migration-notice'
import { ConcentratedPositionsTable } from '~evm/[chainId]/pool/_ui/ConcentratedPositionsTable/concentrated-positions-table'
import { BladePositionsTable } from './blade-positions-table'
import { PositionsTable } from './positions-table'

const createItems = (chainId: SushiSwapChainId | BladeChainId) => {
  return [
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
    ...(isSmartPoolChainId(chainId)
      ? [
          {
            id: 'sushiswap-smart',
            value: 'smart',
            protocol: 'STEER',
            disabled: !isSmartPoolChainId(chainId),
            children: (
              <div className="flex items-center gap-2">
                <span>💡</span> <span>Smart Pool</span>
              </div>
            ),
          },
        ]
      : []),
    ...(isBladeChainId(chainId)
      ? [
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
      : []),
  ] as const
}

export const PositionsTab: FC<{
  chainId: SushiSwapChainId | BladeChainId
}> = ({ chainId }) => {
  const items = useMemo(() => createItems(chainId), [chainId])
  const searchParams = useSearchParams()
  const urlTab = searchParams.get('tab')

  // Find the first non-disabled tab as default
  const defaultTab = useMemo(() => {
    if (urlTab) {
      const matchingItem = items.find(
        (item) => item.value === urlTab && !item.disabled,
      )
      if (matchingItem) {
        return matchingItem.value
      }
    }
    const firstAvailable = items.find((item) => !item.disabled)
    return firstAvailable?.value || 'v3'
  }, [items, urlTab])

  const [tab, setTab] = useState(defaultTab)
  const [hideClosedPositions, setHideClosedPositions] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      {tab === 'v2' ? (
        <V2MigrationNotice />
      ) : (
        <BladeSunsetNotice includeCtaBtn={false} />
      )}

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
        {isSmartPoolChainId(chainId) ? (
          <TabsContent value="smart">
            <SteerSmartPositionsTable chainId={chainId} />
          </TabsContent>
        ) : null}
        {isBladeChainId(chainId) && (
          <TabsContent value="blade">
            <BladePositionsTable chainId={chainId} />
          </TabsContent>
        )}
        <TabsContent value="v3">
          <ConcentratedPositionsTable
            chainId={chainId}
            hideNewSmartPositionButton={true}
            hideNewPositionButton={true}
            hideClosedPositions={hideClosedPositions}
          />
        </TabsContent>
        {isSushiSwapChainId(chainId) && (
          <TabsContent value="v2">
            <PositionsTable
              chainId={chainId}
              rowLink={(row) =>
                `/${getEvmChainById(chainId).key}/pool/v2/${row.pool.address}/add`
              }
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
