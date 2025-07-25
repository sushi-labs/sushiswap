'use client'

import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
} from '@radix-ui/react-icons'
import { type Header, flexRender } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'

import classNames from 'classnames'
import { Button } from '../button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'

type DataTableColumnHeaderProps<TData, TValue> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  header: Header<TData, TValue>
}

export function DataTableColumnHeader<TData, TValue>({
  header,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const onClick = useCallback(() => {
    if (header.column.getIsSorted() === false) {
      // desc
      header.column.toggleSorting(true)
    }

    if (header.column.getIsSorted() === 'desc') {
      // asc
      header.column.toggleSorting(false)
    }

    if (header.column.getIsSorted() === 'asc') {
      // clear
      header.column.clearSorting()
    }
  }, [header.column])

  const className = header?.column.columnDef?.meta?.header?.className
  const description = header.column.columnDef?.meta?.header?.description

  const Title = useMemo(() => {
    const title = header.column.columnDef.header

    if (typeof title === 'string') {
      if (description) {
        return (
          <span className="underline decoration-dotted underline-offset-2 text-muted-foreground">
            {title}
          </span>
        )
      } else {
        return <span className="text-muted-foreground">{title}</span>
      }
    }

    return flexRender(title, header.getContext())
  }, [header, description])

  if (!header.column.getCanSort()) {
    return (
      <div className={className}>
        {description ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{Title}</TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>{Title}</>
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
                <div className="flex flex-row gap-2 ui-items-center dark:text-slate-500 text-slate-450">
                  {Title}
                  {header.column.getIsSorted() === 'desc' ? (
                    <CaretDownIcon className="ml-2 w-4 h-4" />
                  ) : header.column.getIsSorted() === 'asc' ? (
                    <CaretUpIcon className="ml-2 w-4 h-4" />
                  ) : (
                    <CaretSortIcon className="ml-2 w-4 h-4" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      ) : (
        <Button
          onClick={onClick}
          variant="ghost"
          size="xs"
          className="dark:!text-slate-500 !text-slate-450"
        >
          {Title}
          {header.column.getIsSorted() === 'desc' ? (
            <CaretDownIcon className="ml-2 w-4 h-4" />
          ) : header.column.getIsSorted() === 'asc' ? (
            <CaretUpIcon className="ml-2 w-4 h-4" />
          ) : (
            <CaretSortIcon className="ml-2 w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  )
}
