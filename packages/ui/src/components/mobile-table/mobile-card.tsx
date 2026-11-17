'use client'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { type Header, type Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { IconButton } from '../iconbutton'

type MobileCardProps<T> = {
  row: Row<T>
  isExpandedOverride?: boolean
  headers: {
    [k: string]: Header<T, unknown>
  }
  hideExpand?: boolean
}

export function MobileCard<T>({
  row,
  headers,
  isExpandedOverride,
  hideExpand,
}: MobileCardProps<T>): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isExpandedOverride !== undefined) {
      setIsExpanded(isExpandedOverride)
    }
  }, [isExpandedOverride])

  const cellsToShow = useMemo(() => {
    const cells = row.getVisibleCells()
    return isExpanded ? cells : cells.slice(0, 3)
  }, [row, isExpanded])

  return (
    <div
      className={classNames(
        'rounded-2xl border text-xs border-accent bg-secondary p-4 flex gap-2',
        isExpanded ? 'flex-col' : 'flex-row justify-between',
      )}
    >
      <div className="grid grid-cols-3 gap-x-2 gap-y-4 w-full">
        {cellsToShow.map((cell) => {
          const header = headers[cell.column.id]
          const headerContent = header
            ? flexRender(header.column.columnDef.header, header.getContext())
            : cell.column.id

          return (
            <div key={cell.id} className="flex flex-col col-span-1">
              <div className="text-muted-foreground">{headerContent}</div>
              <div>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          )
        })}
      </div>
      {hideExpand ? null : (
        <>
          {isExpanded ? (
            <div className="w-full h-[1px] bg-accent mt-2" />
          ) : null}

          <IconButton
            size="xs"
            className={isExpanded ? 'self-end' : 'self-center'}
            icon={() => (
              <ChevronDownIcon
                className={classNames(
                  'transition-transform w-4 h-4',
                  isExpanded && 'rotate-180',
                )}
              />
            )}
            onClick={() => setIsExpanded((prev) => !prev)}
            name="Toggle Details"
          />
        </>
      )}
    </div>
  )
}
