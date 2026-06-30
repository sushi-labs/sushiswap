'use client'
import { DataTableVirtual, Slot } from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useAssetState } from '../trade-widget'
import { type BasisTradeAsset, useAssetListState } from './asset-list-provider'
import { useAssetSelectorState } from './asset-selector-provider'
import {
  BASIS_DAY_CHANGE_COLUMN,
  BASIS_EIGHT_HOUR_FUNDING_COLUMN,
  BASIS_LAST_PRICE_COLUMN,
  BASIS_OPEN_INTEREST_COLUMN,
  BASIS_SYMBOL_COLUMN,
  BASIS_VOLUME_COLUMN,
} from './columns'

const COLUMNS = [
  BASIS_SYMBOL_COLUMN,
  BASIS_LAST_PRICE_COLUMN,
  BASIS_DAY_CHANGE_COLUMN,
  BASIS_EIGHT_HOUR_FUNDING_COLUMN,
  BASIS_VOLUME_COLUMN,
  BASIS_OPEN_INTEREST_COLUMN,
]

export const BasisTradeAssets = () => {
  const {
    state: {
      assetListQuery: { isLoading },
      basisTradeAssets,
    },
  } = useAssetListState()
  const {
    mutate: { setOpen },
  } = useAssetSelectorState()
  const {
    state: { search },
  } = useAssetSelectorState()
  const {
    mutate: { setActiveBasisTradeAsset },
  } = useAssetState()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'volume24hUsd', desc: true },
  ])
  const filtered = useMemo(() => {
    if (!basisTradeAssets) return []
    const baseData = basisTradeAssets
    return baseData.filter((i) => {
      if (search) {
        return (
          i.spotAsset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          i.spotAsset.name.toLowerCase().includes(search.toLowerCase()) ||
          i.perpAsset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          i.perpAsset.name.toLowerCase().includes(search.toLowerCase())
        )
      }
      return true
    })
  }, [basisTradeAssets, search])

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
    (row: Row<BasisTradeAsset>, rowNode: ReactNode) => {
      return (
        <Slot
          className="cursor-pointer"
          onClick={() => {
            setActiveBasisTradeAsset(row.original)
            setOpen(false)
          }}
          key={`${row.original.spotAsset.name}-${row.original.perpAsset.name}-slot`}
        >
          {rowNode}
        </Slot>
      )
    },
    [setActiveBasisTradeAsset, setOpen],
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
      trClassName="transform-gpu"
      hideScrollbar={true}
      overscan={2}
    />
  )
}
