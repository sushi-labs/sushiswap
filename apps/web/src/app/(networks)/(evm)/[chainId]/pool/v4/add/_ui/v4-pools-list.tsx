'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import type {
  GetPools,
  Pools,
  SushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  LinkInternal,
  Loader,
  SkeletonText,
} from '@sushiswap/ui'
import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import { type ReactElement, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePoolsInfinite } from 'src/lib/hooks/api/use-pools-infinite'
import {
  type EvmCurrency,
  SushiSwapProtocol,
  getEvmChainById,
  getEvmCurrencyAddress,
} from 'sushi/evm'
import {
  APR_WITH_REWARDS_COLUMN,
  EXPLORE_NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
} from '~evm/[chainId]/_ui/columns'

const COLUMNS = [
  EXPLORE_NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  APR_WITH_REWARDS_COLUMN,
] as ColumnDef<Pools[number], unknown>[]

const PROTOCOLS = [SushiSwapProtocol.SUSHISWAP_V4]

interface V4PoolsListProps {
  chainId: SushiSwapV4ChainId
  /** Only pools holding every given currency are listed. */
  currencies: (EvmCurrency | undefined)[]
}

export function V4PoolsList({
  chainId,
  currencies,
}: V4PoolsListProps): ReactElement {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const addresses = currencies.map((currency) =>
    currency ? getEvmCurrencyAddress(currency).toLowerCase() : undefined,
  )

  const {
    data: pools,
    isLoading,
    fetchNextPage,
  } = usePoolsInfinite({
    chainId,
    search: [...new Set(addresses.filter((address) => address !== undefined))],
    protocols: PROTOCOLS,
    orderBy: sorting[0]?.id as GetPools['orderBy'],
    orderDirection: sorting[0]?.desc === false ? 'asc' : 'desc',
  })

  const [data, count] = useMemo(
    () => [
      pools?.pages.flatMap(({ data }) => data) ?? [],
      pools?.pages[0]?.count,
    ],
    [pools],
  )

  const state = useMemo<Partial<TableState>>(
    () => ({
      sorting,
      pagination: { pageIndex: 0, pageSize: data.length },
    }),
    [data.length, sorting],
  )

  const chainKey = getEvmChainById(chainId).key

  // The new pool form starts with the tokens filtered for here
  const params = new URLSearchParams()
  addresses.forEach((address, index) => {
    if (address) params.set(`token${index}`, address)
  })
  const query = params.toString()
  const createPoolHref = `/${chainKey}/pool/v4/add/new${query ? `?${query}` : ''}`

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage}
      hasMore={data.length < (count ?? 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>
              {isLoading ? (
                <div className="!w-28 !h-[18px]">
                  <SkeletonText />
                </div>
              ) : (
                <span>
                  Pools{' '}
                  <span className="text-gray-400 dark:text-slate-500">
                    ({count ?? 0})
                  </span>
                </span>
              )}
            </CardTitle>
            <Button asChild size="sm" icon={PlusIcon}>
              <LinkInternal href={createPoolHref}>Create new pool</LinkInternal>
            </Button>
          </div>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          linkFormatter={(row) => `/${chainKey}/pool/v4/${row.address}/create`}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
