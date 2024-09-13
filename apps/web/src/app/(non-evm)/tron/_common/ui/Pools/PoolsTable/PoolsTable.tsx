'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  SkeletonText,
} from '@sushiswap/ui'
import { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { usePools } from '~tron/_common/lib/hooks/usePools'
import { NAME_COLUMN, RESERVES_COLUMN, TVL_COLUMN } from './PoolColumns'

export type IRowData = {
  name: string
  pairAddress: string
  token0Address: string
  token1Address: string
  reserve0: string
  reserve1: string
}

export const PoolsTable = () => {
  const { tokenSymbols } = usePoolFilters()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data, isLoading } = usePools()

  const filteredData = useMemo(() => {
    if (!data) return []
    if (!tokenSymbols.length) return data
    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase()?.replaceAll(' ', ''),
    )

    return data.filter((pool) => {
      const poolValues = [
        pool.pairAddress,
        // pool.token0?.address,
        // pool.token1?.address,
        // pool.token0?.symbol,
        // pool.token1?.symbol,
        // pool.token0?.name,
        // pool.token1?.name,
      ]

      return queries.every((query) =>
        poolValues.some((value) => value?.toLowerCase()?.includes(query)),
      )
    })
  }, [data, tokenSymbols])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? (
            <div className="!w-28 !h-[18px]">
              <SkeletonText />
            </div>
          ) : (
            <span>
              Pools{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filteredData?.length ?? 0})
              </span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        data={
          filteredData?.map((pool) => ({
            name: `${pool.token0Address}/${pool.token1Address}`,
            pairAddress: pool.pairAddress,
            token0Address: pool.token0Address,
            token1Address: pool.token1Address,
            reserve0: pool.reserve0,
            reserve1: pool.reserve1,
          })) ?? []
        }
        columns={[NAME_COLUMN, TVL_COLUMN, RESERVES_COLUMN]}
        linkFormatter={(data) => {
          const token0 = data.name.split('/')[0]
          const token1 = data.name.split('/')[1]
          return `/tron/pool/${token0}:${token1}:${data.pairAddress}`
        }}
        pagination={true}
        externalLink={false}
        onPaginationChange={setPaginationState}
        state={{
          pagination: paginationState,
        }}
      />
    </Card>
  )
}
