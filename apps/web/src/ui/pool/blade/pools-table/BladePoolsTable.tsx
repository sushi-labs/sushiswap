'use client'

import {} from '@heroicons/react/24/outline'
import { Slot } from '@radix-ui/react-slot'
import type { BladePool, BladePools } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Switch,
  Toggle,
} from '@sushiswap/ui'
import type {
  ColumnDef,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { ChainKey } from 'sushi/chain'
import {
  APR_COLUMN,
  type BladePoolsTableMeta,
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
} from './columns'

const COLUMNS: ColumnDef<BladePool, unknown>[] = [
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  APR_COLUMN,
]

interface BladePoolsTableProps {
  pools: BladePools
  onRowClick?(row: BladePool): void
}

export const BladePoolsTable: FC<BladePoolsTableProps> = ({
  pools,
  onRowClick,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])
  const [showStableCoins, setShowStableCoins] = useState(true)

  const state: Partial<TableState> = useMemo(
    () => ({
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: pools?.length ?? 0,
      },
    }),
    [pools?.length, sorting],
  )

  const rowRenderer = useCallback(
    (row: Row<BladePool>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between flex-wrap gap-2 xs:gap-0">
          <div className="flex items-center gap-2 shrink-0">
            <CardTitle>
              Blade Pools{' '}
              {pools?.length ? (
                <span className="text-gray-400 dark:text-slate-500">
                  ({pools.length})
                </span>
              ) : null}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-center text-muted-foreground text-sm">
              Show stablecoin types
            </span>
            <Switch
              checked={showStableCoins}
              onCheckedChange={setShowStableCoins}
            />
          </div>
        </div>
        <div>
          <CardDescription>
            Blade is a new AMM with up to 100x concentrated liquidity, automated
            rebalancing, and no Impermanent Loss. It combines offchain compute
            with onchain verification so prices update in real-time and your
            liquidity never gets arbitraged.
          </CardDescription>
        </div>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={false}
        linkFormatter={(row) =>
          `/${ChainKey[row.chainId as keyof typeof ChainKey]}/pool/blade/${row.address}`
        }
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={pools ?? []}
        meta={{ showStableCoins } satisfies BladePoolsTableMeta}
      />
    </Card>
  )
}
