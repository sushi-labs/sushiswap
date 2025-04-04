'use client'

import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from '@radix-ui/react-icons'
import type { Column } from '@tanstack/react-table'
import { useCallback } from 'react'

import classNames from 'classnames'
import { Button } from '../button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  description?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  description,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const onClick = useCallback(() => {
    if (column.getIsSorted() === false) {
      // desc
      column.toggleSorting(true)
    }

    if (column.getIsSorted() === 'desc') {
      // asc
      column.toggleSorting(false)
    }

    if (column.getIsSorted() === 'asc') {
      // clear
      column.clearSorting()
    }
  }, [column])

  // When the header (=title) is undefined, it becomes a function, can't render functions...
  if (typeof title !== 'string') {
    title = ''
  }

  if (!column.getCanSort()) {
    return (
      <div className={classNames(className)}>
        {description ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted underline-offset-2">
                  {title}
                </span>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span>{title}</span>
        )}
      </div>
    )
  }

  return (
    <div className={classNames('flex items-center space-x-2', className)}>
      {description ? (
        <Button onClick={onClick} variant="ghost" size="xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-row gap-2 ui-items-center">
                  <span className="underline decoration-dotted underline-offset-2">
                    {title}
                  </span>
                  {column.getIsSorted() === 'desc' ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                  ) : column.getIsSorted() === 'asc' ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                  ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      ) : (
        <Button onClick={onClick} variant="ghost" size="xs">
          <span>{title}</span>
          {column.getIsSorted() === 'desc' ? (
            <CaretDownIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'asc' ? (
            <CaretUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <CaretSortIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
