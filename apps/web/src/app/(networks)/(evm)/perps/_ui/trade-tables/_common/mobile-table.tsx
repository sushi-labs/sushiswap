import { classNames, useTableVirtualizer } from '@sushiswap/ui'
import { useReactTable } from '@tanstack/react-table'
import {
  type ColumnDef,
  type Row,
  getSortedRowModel,
} from '@tanstack/react-table'
import { getCoreRowModel } from '@tanstack/react-table'
import { Fragment, type ReactNode, useMemo, useRef } from 'react'
import { MobileCard } from './mobile-card'
import { MobileCardSkeleton } from './mobile-card-skeleton'

export const MobileTable = <T,>({
  columns,
  data,
  isLoading,
  sorting,
  isExpandedOverride,
  scrollClassName,
  scrollMode = 'element',
  rowRenderer,
  skeleton,
  footer,
}: {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  isLoading: boolean
  sorting: {
    id: string
    desc: boolean
  }[]
  isExpandedOverride?: boolean
  scrollClassName?: string
  scrollMode?: 'element' | 'window'
  rowRenderer?: (row: Row<T>, content: ReactNode) => ReactNode
  skeleton?: ReactNode
  footer?: ReactNode
}) => {
  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const headersById = useMemo(() => {
    return Object.fromEntries(
      table.getFlatHeaders().map((header) => [header.column.id, header]),
    )
  }, [table])

  const { rows } = table.getRowModel()

  const parentRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { virtualizer, scrollMargin } = useTableVirtualizer({
    containerRef: parentRef,
    listRef,
    scrollMode,
    loading: isLoading,
    count: rows.length,
    estimateSize: isExpandedOverride ? 230 : 80,
    overscan: 20,
    getItemKey: (index) => rows[index].id,
  })

  function renderRow(row: Row<T>): ReactNode {
    const content = (
      <MobileCard
        row={row}
        isExpandedOverride={isExpandedOverride}
        headers={headersById}
      />
    )
    return rowRenderer ? rowRenderer(row, content) : content
  }

  if (isLoading) {
    if (skeleton) return skeleton
    return (
      <div className="flex flex-col gap-3">
        <MobileCardSkeleton />
        <MobileCardSkeleton />
        <MobileCardSkeleton />
      </div>
    )
  }

  if (!isLoading && data?.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border text-xs border-accent bg-secondary p-4 flex gap-2 justify-center">
          No results.
        </div>
      </div>
    )
  }

  if (scrollClassName || scrollMode === 'window') {
    return (
      <div
        className={classNames(scrollClassName, 'min-h-[300px]')}
        ref={parentRef}
      >
        <div
          ref={listRef}
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]

            return (
              <div
                className="absolute left-0 top-0 w-full pb-3"
                data-index={virtualRow.index}
                key={row.id}
                ref={virtualizer.measureElement}
                style={{
                  transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                }}
              >
                {renderRow(row)}
              </div>
            )
          })}
        </div>
        {footer}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 min-h-[300px]" ref={parentRef}>
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return <Fragment key={row.id}>{renderRow(row)}</Fragment>
      })}
      {footer}
    </div>
  )
}
