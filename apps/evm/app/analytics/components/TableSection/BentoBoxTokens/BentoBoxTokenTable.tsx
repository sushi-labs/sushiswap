import { Card, CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { PaginationState, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { useFilters } from '../../Filters'
import { BentoBoxTokenFilters } from './BentoBoxTokenFilters'
import { LIQUIDITY_COLUMN, LIQUIDITY_USD_COLUMN, NAME_COLUMN, NETWORK_COLUMN } from './columns'
import { PAGE_SIZE } from './constants'
import { GetBentoBoxTokenArgs, useBentoBoxTokens } from './useBentoBoxTokens'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, LIQUIDITY_USD_COLUMN, LIQUIDITY_COLUMN] as any

export const BentoBoxTokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo<GetBentoBoxTokenArgs>(
    () => ({
      chainIds,
      tokenSymbols,
    }),
    [chainIds, tokenSymbols]
  )

  const { data: bentoBoxTokens, isLoading } = useBentoBoxTokens(args)

  const data = useMemo(() => bentoBoxTokens || [], [bentoBoxTokens])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [pagination, sorting])

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <div className="space-y-4">
        <BentoBoxTokenFilters />
        <Card>
          <CardHeader>
            <CardTitle>
              Tokens{' '}
              {bentoBoxTokens?.length ? (
                <span className="text-gray-400 dark:text-slate-500">({bentoBoxTokens?.length})</span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="!px-0">
            <DataTable
              loading={isLoading}
              columns={COLUMNS}
              data={data}
              pagination={true}
              onPaginationChange={setPagination}
              onSortingChange={setSorting}
              state={state}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
