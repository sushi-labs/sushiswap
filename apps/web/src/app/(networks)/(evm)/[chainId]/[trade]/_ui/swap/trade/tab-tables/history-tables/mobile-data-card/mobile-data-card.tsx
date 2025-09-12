'use client'

import { classNames } from '@sushiswap/ui'
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/react-table'

const CHAIN_IDS = ['chain', 'chainId', 'chain_id']
const ORDER_IDS = ['orderId', 'order_id']
const ACTION_IDS = ['action'] // add more synonyms if needed

function hasAccessor<T>(
  col: ColumnDef<T>,
): col is ColumnDef<T> & { accessorFn: (row: T) => unknown } {
  return (col as any).accessorFn !== undefined
}

function isHeaderFn<T>(
  hdr: ColumnDef<T>['header'],
): hdr is (ctx: HeaderContext<T, unknown>) => any {
  return typeof hdr === 'function'
}

function isCellFn<T>(
  cell: ColumnDef<T>['cell'],
): cell is (ctx: CellContext<T, unknown>) => any {
  return typeof cell === 'function'
}

function renderColValue<T>(col: ColumnDef<T>, row: T): React.ReactNode {
  if (isCellFn(col.cell)) {
    return col.cell({ row: { original: row } } as any)
  }
  if (col.cell !== undefined) return col.cell as React.ReactNode
  if (hasAccessor(col) && col.accessorFn) return col.accessorFn(row) as any
  return (row as any)[col.id as keyof T]
}

type MobileDataCardProps<T extends object> = {
  row: T
  columns: ColumnDef<T>[]
  className?: string
}

export const MobileDataCard = <T extends object>({
  row,
  columns,
  className,
}: MobileDataCardProps<T>) => {
  const chainCol = columns.find((c) => CHAIN_IDS.includes(String(c.id)))
  const orderCol = columns.find((c) => ORDER_IDS.includes(String(c.id)))
  const actionCol = columns.find((c) => ACTION_IDS.includes(String(c.id)))

  const bodyCols = columns.filter(
    (c) => c !== chainCol && c !== orderCol && c !== actionCol,
  )

  const pairs: ColumnDef<T>[][] = []
  for (let i = 0; i < bodyCols.length; i += 2) {
    pairs.push(bodyCols.slice(i, i + 2))
  }

  return (
    <div className={classNames('space-y-4', className)}>
      {(chainCol || orderCol) && (
        <div className="flex items-center justify-between pb-2 mb-2 font-medium">
          {chainCol && (
            <div className="flex items-center gap-1">
              {renderColValue(chainCol, row)}
            </div>
          )}
          {orderCol && (
            <div className="text-xs font-medium text-muted-foreground">
              Order ID:&nbsp;{renderColValue(orderCol, row)}
            </div>
          )}
        </div>
      )}

      {pairs.map((pair, i) => (
        <div key={i} className="flex justify-between gap-4">
          {pair.map((col) => {
            const label = isHeaderFn(col.header)
              ? col.header({} as any)
              : (col.header ?? col.id)

            const value = renderColValue(col, row)

            return (
              <div key={col.id} className="flex-1">
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  {label}
                </div>
                <div className="text-sm font-medium">{value}</div>
              </div>
            )
          })}

          {pair.length === 1 && <div className="flex-1" />}
        </div>
      ))}

      {actionCol && <div>{renderColValue(actionCol, row)}</div>}
    </div>
  )
}
