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
import type { PerpOrSpotAsset } from 'src/lib/perps'
import { useAssetState } from '../trade-widget'
import { useAssetListState } from './asset-list-provider'
import { useAssetSelectorState } from './asset-selector-provider'
import {
  DAY_CHANGE_COLUMN,
  EIGHT_HOUR_FUNDING_COLUMN,
  LAST_PRICE_COLUMN,
  OPEN_INTEREST_COLUMN,
  SYMBOL_COLUMN,
  VOLUME_COLUMN,
} from './columns'

const COLUMNS = [
  SYMBOL_COLUMN,
  LAST_PRICE_COLUMN,
  DAY_CHANGE_COLUMN,
  EIGHT_HOUR_FUNDING_COLUMN,
  VOLUME_COLUMN,
  OPEN_INTEREST_COLUMN,
]

export const HIP3Assets = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage(
    'sushi.perps.selected-search-asset-hip-3-tab',
    'All',
  )
  const {
    state: {
      assetListQuery: { data, isLoading },
      uniqueDexes,
    },
  } = useAssetListState()
  const {
    mutate: { setOpen },
  } = useAssetSelectorState()
  const {
    state: { search },
  } = useAssetSelectorState()
  const {
    mutate: { setActiveAsset },
  } = useAssetState()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'volume24hUsd', desc: true },
  ])
  const filtered = useMemo(() => {
    if (!data) return []
    const baseData = Array.from(data.values())
      .filter((asset) => asset.marketType === 'perp')
      .filter((asset) => !!asset.dex)

    const allData = baseData.filter((asset) => {
      if (search) {
        return (
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return true
    })
    if (selectedTab === 'All') {
      return allData
    }
    return allData.filter((asset) => {
      return asset?.dex.toLowerCase() === selectedTab.toLowerCase()
    })
  }, [data, search, selectedTab])

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
  const TABS = useMemo(() => {
    return ['All', ...uniqueDexes]
  }, [uniqueDexes])
  return (
    <Tabs
      className="w-full"
      value={selectedTab}
      onValueChange={(val) => {
        setSelectedTab(val)
      }}
    >
      <TabsList className="!flex !px-0 !h-8 mx-2 !max-w-fit  bg-transparent border-transparent">
        {TABS.map((tab, idx) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex flex-1 !px-1.5 !max-w-fit !text-xs !bg-transparent !border-transparent"
          >
            {tab}
            {idx !== TABS.length - 1 ? (
              <span className="h-[10px] w-px bg-perps-muted-20 ml-3" />
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={selectedTab}
        className="min-h-[calc(100dvh-140px)] !mt-0 max-h-[calc(100dvh-140px)] lg:min-h-[410px] lg:max-h-[410px] overflow-auto hide-scrollbar max-w-[100vw]"
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
        />
      </TabsContent>
    </Tabs>
  )
}
