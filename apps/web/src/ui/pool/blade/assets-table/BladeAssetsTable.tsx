'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Card, CardHeader, CardTitle, DataTable, Switch } from '@sushiswap/ui'
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { type FC, useMemo, useState } from 'react'
import { type BladePoolAsset, getPoolAssets } from 'src/lib/pool/blade'
import {
  COMPOSITION_COLUMN,
  NAME_COLUMN,
  PRICE_COLUMN,
  TVL_COLUMN,
} from './columns'

const COLUMNS = [
  NAME_COLUMN,
  PRICE_COLUMN,
  TVL_COLUMN,
  COMPOSITION_COLUMN,
] as ColumnDef<BladePoolAsset, unknown>[]

interface BladeAssetsTableProps {
  pool: BladePool
}

export const BladeAssetsTable: FC<BladeAssetsTableProps> = ({ pool }) => {
  const [showStableTypes, setShowStableTypes] = useState(false)

  const data = useMemo(() => {
    return getPoolAssets(pool, { showStableTypes }).filter(
      (asset) => asset.targetWeight > 0,
    )
  }, [pool, showStableTypes])

  const state: Partial<TableState> = useMemo(
    () => ({
      pagination: {
        pageIndex: 0,
        pageSize: data.length ?? 0,
      },
    }),
    [data.length],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <CardTitle>Assets</CardTitle>
          <div className="flex min-w-[220px] items-center justify-end gap-3">
            <span className="text-center text-muted-foreground text-sm">
              Show stablecoin types
            </span>
            <Switch
              checked={showStableTypes}
              onCheckedChange={setShowStableTypes}
            />
          </div>
        </div>
      </CardHeader>
      <DataTable state={state} loading={!pool} columns={COLUMNS} data={data} />
    </Card>
  )
}
