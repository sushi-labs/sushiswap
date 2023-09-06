import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/graph-client'
import { Card, CardContent, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { PaginationState, SortingState, TableState } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

import { useFilters } from '../../Filters'
import { LIQUIDITY_COLUMN, NAME_COLUMN, NETWORK_COLUMN, PRICE_COLUMN, VOLUME_COLUMN } from './columns'
import { TokenFilters } from './TokenFilters'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, PRICE_COLUMN, LIQUIDITY_COLUMN, VOLUME_COLUMN] as any

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: Partial<{
    sorting: SortingState
    pagination: PaginationState
    tokenSymbols: string[]
    extraQuery: string
    chainIds: ChainId[]
  }>
}) => {
  const _url = new URL(url, window.location.origin)

  if (args?.sorting?.[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args?.pagination) {
    _url.searchParams.set('pagination', stringify(args.pagination))
  }

  if (args?.chainIds) {
    _url.searchParams.set('networks', stringify(args.chainIds))
  }

  let where = {}
  if (args?.tokenSymbols) {
    where = {
      symbol_contains_nocase: args.tokenSymbols[0],
    }

    _url.searchParams.set('where', stringify(where))
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const TokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])

  const args = useMemo(
    () => ({ sorting, pagination, chainIds, tokenSymbols }),
    [sorting, pagination, chainIds, tokenSymbols]
  )

  const { data: tokens, isValidating } = useSWR<Token[]>({ url: '/analytics/api/tokens', args }, () =>
    fetcher({ url: '/analytics/api/tokens', args })
  )
  const { data: tokenCount } = useSWR<number>(
    `/analytics/api/tokens/count${chainIds ? `?networks=${stringify(chainIds)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const data = useMemo(() => tokens || [], [tokens])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  return (
    <div className="space-y-4">
      <TokenFilters />
      <Card>
        <CardHeader>
          <CardTitle>
            Tokens {tokenCount ? <span className="text-gray-400 dark:text-slate-500">({tokenCount})</span> : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isValidating}
            columns={COLUMNS}
            data={data}
            pagination={true}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            state={state}
            linkFormatter={(row) => `/analytics/token/${row.id}`}
          />
        </CardContent>
      </Card>
    </div>
  )
}
