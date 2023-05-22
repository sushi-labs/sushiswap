'use client'

import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { DATE_FILTERS } from '../lib'

const SORT_OPTIONS = {
  key: 'sortForumPosts',
  options: [
    { title: 'Recent Activity', key: 'activity' },
    { title: 'Published Lately', key: 'created' },
    { title: 'Hottest Topics', key: 'default' },
  ],
}

export function GovernanceFilters() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const selectedDateFilter =
    DATE_FILTERS.options.find((o) => o.key === params.get(DATE_FILTERS.key)) ?? DATE_FILTERS.options[3]

  function filterDate(filterKey: string) {
    filterKey === 'all' ? params.delete(DATE_FILTERS.key) : params.set(DATE_FILTERS.key, filterKey)
    replace(`${pathname}?${params.toString()}`)
  }

  const selectedSortOption =
    SORT_OPTIONS.options.find((o) => o.key === params.get(SORT_OPTIONS.key)) ?? SORT_OPTIONS.options[0]

  function sortForumPosts(sortKey: string) {
    params.set(SORT_OPTIONS.key, sortKey)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      <Listbox value={selectedSortOption} onChange={(sortBy) => sortForumPosts(sortBy.key)}>
        <div className="relative mt-1 text-sm font-medium text-slate-300">
          <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
            <span className="block truncate">Sort By: {selectedSortOption.title}</span>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-slate-800 py-1">
            {SORT_OPTIONS.options.map((option) => (
              <Listbox.Option
                key={option.key}
                value={option}
                className="flex h-9 items-center rounded-lg px-3 hover:cursor-default hover:bg-slate-700"
              >
                {option.title}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <Listbox value={selectedDateFilter} onChange={(dateFilter) => filterDate(dateFilter.key)}>
        <div className="relative mt-1 text-sm font-medium text-slate-300">
          <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
            <span className="block truncate">Filter By: {selectedDateFilter.title}</span>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-slate-800 py-1">
            {DATE_FILTERS.options.map((option) => (
              <Listbox.Option
                key={option.title}
                value={option}
                className="flex h-9 items-center rounded-lg px-3 hover:cursor-default hover:bg-slate-700"
              >
                {option.title}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}
