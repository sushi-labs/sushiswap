import { useLocalStorage } from '@sushiswap/hooks'
import {
  DataTable,
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
    'all',
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
    const baseData = Array.from(data.values()).filter(
      (asset) => asset.marketType === 'spot',
    )

    const allData = baseData.filter((asset) => {
      if (search) {
        return (
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return true
    })
    if (selectedTab === 'all') {
      return allData
    }
    return allData.filter((asset) => {
      return asset?.tokens?.some(
        (token) => token.name.toLowerCase() === selectedTab.toLowerCase(),
      )
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
      value={selectedTab}
      onValueChange={(val) => {
        setSelectedTab(val)
      }}
    >
      <TabsList className="!flex !px-0 !h-8 !max-w-fit bg-secondary">
        {['all', ...spotCollateralTokens].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex flex-1 !px-1.5 !max-w-fit !text-xs capitalize"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={selectedTab}
        className="max-h-[calc(80vh-215px)] md:max-h-[calc(80vh-240px)] overflow-auto"
      >
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={filtered}
          thClassName="!h-8"
          hideScrollbar={true}
        />
      </TabsContent>
    </Tabs>
  )
}
