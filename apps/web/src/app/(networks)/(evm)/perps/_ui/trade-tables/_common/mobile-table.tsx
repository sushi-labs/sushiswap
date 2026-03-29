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
}: {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  isLoading: boolean
  sorting: {
    id: string
    desc: boolean
  }[]
  isExpandedOverride?: boolean
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
