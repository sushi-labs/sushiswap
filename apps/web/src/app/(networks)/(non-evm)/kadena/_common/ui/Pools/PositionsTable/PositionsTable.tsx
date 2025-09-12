'use client'

import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import type { PaginationState } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { usePoolFilters } from 'src/ui/pool'
import { useMyPositions } from '~kadena/_common/lib/hooks/use-my-positions'
import type { WalletPosition } from '~kadena/_common/types/get-positions'
import {
  APR_COLUMN,
  POSITION_NAME_COLUMN,
  VALUE_COLUMN,
} from './PositionColumns'

const columns = [POSITION_NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]
export const PositionsTable = () => {
  const { tokenSymbols } = usePoolFilters()

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading } = useMyPositions(50)

  const positions = useMemo(() => {
    return data?.positions ?? []
  }, [data])

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

  const totalCount = useMemo(() => {
    return data?.pages?.[0]?.totalCount ?? 0
  }, [data])
  const filteredCount = useMemo(() => {
    return filteredPositions?.length
  }, [filteredPositions])

  const paginatedData = useMemo(() => {
    const start = paginationState.pageIndex * paginationState.pageSize
    const end = start + paginationState.pageSize
    return filteredPositions.slice(start, end)
  }, [filteredPositions, paginationState])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <span>
              My Positions{' '}
              <span className="text-gray-400 dark:text-slate-500">
                ({filteredCount < totalCount ? filteredCount : totalCount})
              </span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <DataTable
        loading={isLoading}
        data={paginatedData}
        columns={columns}
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
