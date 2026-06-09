import { DataTableVirtual, Slot } from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { type PerpOrSpotAsset, useFavoriteAssets } from 'src/lib/perps'
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

export const FavoriteAssets = () => {
  const {
    state: {
      assetListQuery: { data, isLoading },
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
  const { favoriteSet } = useFavoriteAssets()

  const filtered = useMemo(() => {
    if (!data) return []
    const baseData = Array.from(data.values()).filter((asset) =>
      favoriteSet.has(asset.name),
    )
    return baseData.filter((asset) => {
      if (search) {
        return (
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return true
    })
  }, [data, search, favoriteSet])

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
  )
}
