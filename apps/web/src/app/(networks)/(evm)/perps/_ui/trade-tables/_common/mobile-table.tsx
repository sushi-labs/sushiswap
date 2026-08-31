import { classNames } from '@sushiswap/ui'
import { useReactTable } from '@tanstack/react-table'
import { type ColumnDef, getSortedRowModel } from '@tanstack/react-table'
import { getCoreRowModel } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef } from 'react'
import { MobileCard } from './mobile-card'
import { MobileCardSkeleton } from './mobile-card-skeleton'

export const MobileTable = <T,>({
  columns,
  data,
  isLoading,
  sorting,
  isExpandedOverride,
  scrollClassName,
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

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isExpandedOverride ? 230 : 80),
    overscan: 20,
  })

  if (isLoading) {
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

  if (scrollClassName) {
    return (
      <div
        className={classNames(scrollClassName, 'min-h-[300px]')}
        ref={parentRef}
      >
        <div
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
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <MobileCard
                  row={row}
                  isExpandedOverride={isExpandedOverride}
                  headers={headersById}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 min-h-[300px]" ref={parentRef}>
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return (
          <MobileCard
            key={row.id}
            row={row}
            isExpandedOverride={isExpandedOverride}
            headers={headersById}
          />
        )
      })}
    </div>
  )
}
