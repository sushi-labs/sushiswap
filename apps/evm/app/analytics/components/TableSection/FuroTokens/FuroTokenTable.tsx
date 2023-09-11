import { Card, CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { Container } from '@sushiswap/ui/components/container'
import { PaginationState, SortingState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { useFilters } from '../../Filters'
import { LIQUIDITY_COLUMN, LIQUIDITY_USD_COLUMN, NAME_COLUMN, NETWORK_COLUMN } from './columns'
import { FuroTokenFilters } from './FuroTokenFilters'
import { GetFuroTokenArgs, useFuroTokens } from './useFuroTokens'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, LIQUIDITY_USD_COLUMN, LIQUIDITY_COLUMN] as any

export const FuroTokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

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
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <div className="space-y-4">
        <FuroTokenFilters />
        <Card>
          <CardHeader>
            <CardTitle>
              Tokens{' '}
              {furoTokens?.length ? (
                <span className="text-gray-400 dark:text-slate-500">({furoTokens?.length})</span>
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
              state={{
                sorting,
                pagination,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
