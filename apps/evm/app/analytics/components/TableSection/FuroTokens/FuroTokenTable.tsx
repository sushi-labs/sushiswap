'use client'

import { Card, CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { PaginationState, SortingState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { usePoolFilters } from '../../../../../ui/pool'
import { LIQUIDITY_COLUMN, LIQUIDITY_USD_COLUMN, NAME_COLUMN } from './columns'
import { GetFuroTokenArgs, useFuroTokens } from './useFuroTokens'

const COLUMNS = [NAME_COLUMN, LIQUIDITY_USD_COLUMN, LIQUIDITY_COLUMN] as any

export const FuroTokenTable: FC = () => {
  const { chainIds, tokenSymbols } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const args = useMemo<GetFuroTokenArgs>(
    () => ({
      chainIds,
      tokenSymbols,
    }),
    [chainIds, tokenSymbols]
  )

  const { data: furoTokens, isLoading } = useFuroTokens(args)

  const data = useMemo(() => furoTokens || [], [furoTokens])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Tokens{' '}
          {furoTokens?.length ? (
            <span className="text-gray-400 dark:text-slate-500">({furoTokens?.length})</span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0 !pb-0">
        <DataTable
          loading={isLoading}
          columns={COLUMNS}
          data={data}
          pagination={true}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          state={{
            sorting,
            pagination,
          }}
        />
      </CardContent>
    </Card>
  )
}
