import { Slot } from '@radix-ui/react-slot'
import { GetPoolsArgs, Pool, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import { useBreakpoint } from '@sushiswap/hooks'
import { DataTable } from '@sushiswap/ui'
import { Loader } from '@sushiswap/ui'
import { SheetContent, SheetTrigger } from '@sushiswap/ui/components/sheet'
import { Sheet } from '@sushiswap/ui/components/sheet'
import { ColumnDef, Row, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'

import Page from '../../../../../app/pool/[id]/page'
import { usePoolFilters } from '../../../PoolsFiltersProvider'
import {
  TableFiltersFarmsOnly,
  TableFiltersPoolType,
  TableFiltersResetButton,
  TableFiltersSearchToken,
} from '../TableFilters'
import { TableFiltersNetwork } from '../TableFilters/TableFiltersNetwork'
import {
  APR_COLUMN,
  FEES_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_7D_COLUMN,
} from './Cells/columns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_COLUMN,
  APR_COLUMN,
] satisfies ColumnDef<Pool, unknown>[]

export const PoolsTable: FC = () => {
  const { chainIds, tokenSymbols, protocols, farmsOnly } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [peekedId, setPeekedId] = useState<{ id: string }>({ id: '' })
  const { is2xl } = useBreakpoint('2xl')

  const args = useMemo<GetPoolsArgs>(() => {
    return {
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: farmsOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      isWhitelisted: true, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
    }
  }, [chainIds, tokenSymbols, protocols, farmsOnly, sorting])

  const {
    data: pools,
    isValidating,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const { data: poolCount } = usePoolCount({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const data = useMemo(() => pools?.flat() || [], [pools])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  const sheetTriggerRenderer = useCallback((row: Row<Pool>, rowNode: ReactNode) => {
    return (
      <_SheetTrigger showSheet={true} row={row} onPeek={setPeekedId}>
        {rowNode}
      </_SheetTrigger>
    )
  }, [])

  const normalTriggerRenderer = useCallback((row: Row<Pool>, rowNode: ReactNode) => {
    return (
      <_SheetTrigger showSheet={false} row={row} onPeek={setPeekedId}>
        {rowNode}
      </_SheetTrigger>
    )
  }, [])

  if (is2xl) {
    return (
      <div className="grid grid-cols-[auto_616px] pt-4">
        <div className="pr-8">
          <div className="flex flex-col sm:flex-row gap-3 pb-4">
            <TableFiltersSearchToken />
            <TableFiltersPoolType />
            <TableFiltersNetwork />
            <TableFiltersFarmsOnly />
            <TableFiltersResetButton />
          </div>
          <InfiniteScroll
            dataLength={data.length}
            next={() => setSize((prev) => prev + 1)}
            hasMore={data.length < (poolCount?.count || 0)}
            loader={
              <div className="flex justify-center w-full py-4">
                <Loader size={16} />
              </div>
            }
          >
            <DataTable
              state={state}
              onSortingChange={setSorting}
              loading={!pools && isValidating}
              rowRenderer={normalTriggerRenderer}
              columns={COLUMNS}
              data={data}
            />
          </InfiniteScroll>
        </div>
        <div className="pt-[56px]">
          <Page params={peekedId} />
        </div>
      </div>
    )
  } else {
    return (
      <Sheet modal defaultOpen={Boolean(peekedId.id !== '')}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4 pt-4">
          <TableFiltersSearchToken />
          <TableFiltersPoolType />
          <TableFiltersNetwork />
          <TableFiltersFarmsOnly />
          <TableFiltersResetButton />
        </div>
        <InfiniteScroll
          dataLength={data.length}
          next={() => setSize((prev) => prev + 1)}
          hasMore={data.length < (poolCount?.count || 0)}
          loader={
            <div className="flex justify-center w-full py-4">
              <Loader size={16} />
            </div>
          }
        >
          <DataTable
            state={state}
            onSortingChange={setSorting}
            loading={!pools && isValidating}
            rowRenderer={sheetTriggerRenderer}
            columns={COLUMNS}
            data={data}
          />
        </InfiniteScroll>
        <SheetContent side="right" className="overflow-auto min-w-[calc(100vw-16px)] md:min-w-[80vw] max-w-7xl">
          <Page params={peekedId} />
        </SheetContent>
      </Sheet>
    )
  }
}

const _SheetTrigger: FC<{
  showSheet?: boolean
  row: Row<Pool>
  children: ReactNode
  onPeek({ id }: { id: string }): void
}> = ({ showSheet, row, children, onPeek }) => {
  const onMouseEnter = useCallback(() => {
    onPeek({ id: `${row.original.chainId}%3A${row.original.address}` })
  }, [onPeek, row.original.address, row.original.chainId])

  if (!showSheet) {
    return <Slot onClick={onMouseEnter}>{children}</Slot>
  }

  return (
    <SheetTrigger asChild onMouseEnter={onMouseEnter} type={undefined}>
      {children}
    </SheetTrigger>
  )
}
