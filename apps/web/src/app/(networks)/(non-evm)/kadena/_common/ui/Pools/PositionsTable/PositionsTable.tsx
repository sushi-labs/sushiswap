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

import type { WalletPosition } from '~kadena/_common/types/get-positions'
import {
  APR_COLUMN,
  POSITION_NAME_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

type PositionsTableProps = {
  hideNewPositionButton?: boolean
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
        pool.pair.token0.address,
        pool.pair.token1.address,
        pool.pair.token0.name,
        pool.pair.token1.name,
      ]
      return poolValues.some((value) =>
        queries.some((query) => value.toLowerCase().includes(query)),
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
                ({paginatedFilteredData?.length})
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
        data={paginatedFilteredData}
        columns={[POSITION_NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]}
        linkFormatter={(data: WalletPosition) =>
          `/kadena/pool/${encodeURIComponent(data.pairId)}/add`
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
