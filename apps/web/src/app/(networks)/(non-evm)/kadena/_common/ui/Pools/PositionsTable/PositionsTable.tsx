'use client'

import { PlusIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  DataTable,
  LinkInternal,
} from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { useMyPositions } from '~kadena/_common/lib/hooks/use-my-positions'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import {
  APR_COLUMN,
  POSITION_NAME_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

type PositionsTableProps = {
  hideNewPositionButton?: boolean
}

export type IPositionRowData = {
  token0: {
    address: string
    symbol: string
    name: string
  }
  token1: {
    address: string
    symbol: string
    name: string
  }
  poolId: string
  reserve0: string
  reserve1: string
  apr24h: string
  valueUsd: string
}

export const PositionsTable = ({
  hideNewPositionButton,
}: PositionsTableProps) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const { tokenSymbols } = usePoolFilters()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyPositions()

  const positions = data?.positions ?? []

  const start = paginationState.pageIndex * paginationState.pageSize
  const end = start + paginationState.pageSize

  useEffect(() => {
    if (end > positions.length && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [end, positions.length, hasNextPage, isFetchingNextPage, fetchNextPage])

  const filteredPositions = useMemo(() => {
    if (!positions.length || !tokenSymbols.length) return positions

    const queries = tokenSymbols.map((symbol) =>
      symbol.toLowerCase().replaceAll(' ', ''),
    )

    return positions.filter((pool) => {
      const poolValues = [
        pool.pair.address,
        pool.pair.reserve0,
        pool.pair.reserve1,
      ]
      return poolValues.some((value) =>
        queries.some((query) =>
          typeof value === 'string'
            ? value.toLowerCase().includes(query)
            : value.symbol.toLowerCase().includes(query),
        ),
      )
    })
  }, [tokenSymbols, positions])

  const paginatedFilteredData = filteredPositions.slice(start, end)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>
              My Positions{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({paginatedFilteredData.length})
              </span>
            </span>
            <div className="flex gap-4">
              {!hideNewPositionButton ? (
                <LinkInternal shallow={true} href={`/kadena/pool/add`}>
                  <Button icon={PlusIcon} asChild size="sm">
                    Create position
                  </Button>
                </LinkInternal>
              ) : null}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        data={paginatedFilteredData.map((pool) => ({
          token0: {
            address: pool?.pair.reserve0.name,
            symbol: pool?.pair.reserve0.symbol,
            name: pool?.pair.reserve0.name,
          },
          token1: {
            address: pool?.pair.reserve1.name,
            symbol: pool?.pair.reserve1.symbol,
            name: pool?.pair.reserve1.name,
          },
          poolId: pool?.id,
          reserve0: pool?.pair.reserve0.amount,
          reserve1: pool?.pair.reserve1.amount,
          apr24h: pool?.apr24h,
          valueUsd: pool?.valueUsd,
        }))}
        columns={[POSITION_NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]}
        linkFormatter={(data: IPositionRowData) =>
          `/kadena/pool/${encodeURIComponent(data.poolId)}/add`
        }
        externalLink={false}
        pagination={true}
        state={{
          pagination: paginationState,
        }}
        onPaginationChange={setPaginationState}
      />
    </Card>
  )
}
