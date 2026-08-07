import { useLocalStorage } from '@sushiswap/hooks'
import {
  DataTableVirtual,
  Slot,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { type PerpOrSpotAsset, isStrictSpotAsset } from 'src/lib/perps'
import { useAssetState } from '../trade-widget'
import { useAssetListState } from './asset-list-provider'
import { useAssetSelectorState } from './asset-selector-provider'
import {
  DAY_CHANGE_COLUMN,
  LAST_PRICE_COLUMN,
  MARKET_CAP_COLUMN,
  SYMBOL_COLUMN,
  VOLUME_COLUMN,
} from './columns'

const COLUMNS = [
  SYMBOL_COLUMN,
  LAST_PRICE_COLUMN,
  DAY_CHANGE_COLUMN,
  VOLUME_COLUMN,
  MARKET_CAP_COLUMN,
]

export const SpotAssets = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage(
    'sushi.perps.selected-search-asset-spot-tab',
    'All',
  )
  const {
    state: {
      assetListQuery: { data, isLoading },
      spotCollateralTokens,
    },
  } = useAssetListState()
  const {
    mutate: { setOpen },
  } = useAssetSelectorState()
  const {
    state: { search, listMode },
  } = useAssetSelectorState()
  const {
    mutate: { setActiveAsset },
  } = useAssetState()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'volume24hUsd', desc: true },
  ])
  const TABS = useMemo(() => {
    if (!data || listMode === 'all') return ['All', ...spotCollateralTokens]

    const tokens = new Set<string>()
    data.forEach((asset) => {
      if (asset.marketType !== 'spot') return
      if (!isStrictSpotAsset(asset)) return

      const token = asset.tokens?.[1]?.name
      if (token) tokens.add(token)
    })

    return ['All', ...tokens]
  }, [data, listMode, spotCollateralTokens])
  const activeTab = TABS.includes(selectedTab) ? selectedTab : 'All'

  const filtered = useMemo(() => {
    if (!data) return []
    const baseData = Array.from(data.values()).filter(
      (asset) => asset.marketType === 'spot',
    )

    const allData = baseData.filter((asset) => {
      if (listMode === 'strict' && !isStrictSpotAsset(asset)) return false

      if (search) {
        return (
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return true
    })
    if (activeTab === 'All') {
      return allData
    }
    return allData.filter((asset) => {
      return asset?.tokens?.some(
        (token) => token.name.toLowerCase() === activeTab.toLowerCase(),
      )
    })
  }, [data, search, activeTab, listMode])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: filtered?.length,
      },
    }
  }, [filtered, sorting])

  const rowRenderer = useCallback(
    (row: Row<PerpOrSpotAsset>, rowNode: ReactNode) => {
      return (
        <Slot
          className="cursor-pointer"
          onClick={() => {
            setActiveAsset(row.original.name)
            setOpen(false)
          }}
          key={`${row.original.name}-${row.original.dex}-slot`}
        >
          {rowNode}
        </Slot>
      )
    },
    [setActiveAsset, setOpen],
  )

  return (
    <Tabs
      className="w-full"
      value={activeTab}
      onValueChange={(val) => {
        setSelectedTab(val)
      }}
    >
      <TabsList
        className="!flex w-fit overflow-x-auto !px-0 !mx-2 !h-8 bg-transparent border-transparent !justify-start hide-scrollbar overflow-y-hidden"
        style={{
          maxWidth: `calc(100vw - 16px)`,
        }}
      >
        {TABS.map((tab, idx) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex flex-1 !px-1.5 !max-w-fit !text-xs capitalize !bg-transparent !border-transparent"
          >
            {tab}
            {idx !== TABS.length - 1 ? (
              <span className="h-[10px] w-px bg-perps-muted-20 ml-3" />
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={activeTab}
        className="!mt-0 hide-scrollbar lg:!min-h-[410px] lg:!max-h-[410px] overflow-auto max-w-[100vw]"
        style={{
          minHeight: 'calc(100dvh - 115px)',
          maxHeight: 'calc(100dvh - 115px)',
        }}
      >
        <DataTableVirtual
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={filtered}
          thClassName="!h-8 pl-0"
          hideScrollbar={true}
          overscan={3}
        />
      </TabsContent>
    </Tabs>
  )
}
