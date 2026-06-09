import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'

import { DownTriangleIcon } from '../../icons/DownTriangleIcon'
import { Button } from '../button'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectPrimitive,
} from '../select'
interface DataTableVirtualPaginationProps<TData> {
  table: Table<TData>
}

export function DataTableVirtualPagination<TData>({
  table,
}: DataTableVirtualPaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination

  const totalRows = table.getPrePaginationRowModel().rows.length

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1

  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-perps-muted">
      <div className="flex items-center gap-0.5">
        <p className="text-sm font-medium whitespace-nowrap">Rows per page:</p>

        <Select
          value={`${pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectPrimitive.Trigger asChild>
            <Button variant="ghost" size="xs">
              {pageSize} <DownTriangleIcon width={6} height={6} />
            </Button>
          </SelectPrimitive.Trigger>

          <SelectContent side="top" className="!bg-black/10">
            {[5, 10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="whitespace-nowrap flex min-w-[120px] items-center justify-center text-sm font-medium">
        {startRow}-{endRow} of {totalRows.toLocaleString()}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="perps-secondary"
          className="p-0 !text-perps-muted-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="perps-secondary"
          className="p-0 !text-perps-muted-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
