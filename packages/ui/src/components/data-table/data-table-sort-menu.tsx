'use client'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import type { OnChangeFn, SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Button } from '../button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu'

interface DataTableSortMenuProps {
  options: readonly { id: string; label: string }[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  label: string
  className?: string
}

export function DataTableSortMenu({
  options,
  sorting,
  onSortingChange,
  label,
  className,
}: DataTableSortMenuProps): ReactNode {
  const defaultOption = options[0]
  if (!defaultOption) return null

  const selectedSort = options.find((option) => option.id === sorting[0]?.id)
  const sortLabel = selectedSort?.label ?? 'Default'
  const isAscending = sorting[0]?.desc === false
  const sortDescription = `${sortLabel}, ${isAscending ? 'lowest first' : 'highest first'}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button
          aria-label={`Sort ${label} by ${sortDescription}`}
          title={sortDescription}
          variant="secondary"
          size="sm"
          icon={isAscending ? ArrowUpIcon : ArrowDownIcon}
          iconProps={{ className: 'shrink-0' }}
          iconPosition="end"
          className="min-w-0"
        >
          <span className="truncate">{sortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sorting[0]?.id ?? ''}
          onValueChange={(id) => {
            const option = options.find((option) => option.id === id)
            if (option) {
              onSortingChange([
                { id: option.id, desc: sorting[0]?.desc ?? true },
              ])
            }
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          aria-label="Sort direction"
          value={isAscending ? 'asc' : 'desc'}
          onValueChange={(direction) =>
            onSortingChange([
              {
                id: selectedSort?.id ?? defaultOption.id,
                desc: direction === 'desc',
              },
            ])
          }
        >
          <DropdownMenuRadioItem value="desc">
            Highest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc">
            Lowest first
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
