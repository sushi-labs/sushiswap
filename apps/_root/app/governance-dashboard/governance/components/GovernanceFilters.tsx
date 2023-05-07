'use client'

import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import React, { useReducer } from 'react'

const DATE_FILTERS = ['Last 30 Days', 'Last 60 Days', 'Last 90 Days', 'All Time']
const TYPE_FILTERS = ['General', 'Proposal', 'Discussions', 'Temp Check', 'Signal', 'Implementation']
const SORT_OPTIONS = ['Recent Activity', 'Published Lately', 'Hottest Topics']

const INITIAL_FILTERS = {
  dateFilter: 'Last 30 Days',
  typeFilter: ['General'],
  sortBy: 'Recent Activity',
}

function reducer(
  state: { dateFilter: string; typeFilter: string[]; sortBy: string },
  { type, payload }: { type: string; payload: string | string[] }
) {
  return {
    ...state,
    [type]: payload,
  }
}

export function GovernanceFilters() {
  const [filters, dispatch] = useReducer(reducer, INITIAL_FILTERS)

  // TODO: put filters in url

  return (
    <div className="flex gap-2">
      <Listbox value={filters.sortBy} onChange={(sortBy) => dispatch({ type: 'sortBy', payload: sortBy })}>
        <div className="relative mt-1 text-sm font-medium text-slate-300">
          <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
            <span className="block truncate">Sort By: {filters.sortBy}</span>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-slate-800 py-1">
            {SORT_OPTIONS.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className="flex h-9 items-center rounded-lg px-3 hover:cursor-default hover:bg-slate-700"
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <Listbox
        value={filters.typeFilter}
        onChange={(typeFilter) => dispatch({ type: 'typeFilter', payload: typeFilter })}
        multiple
      >
        <div className="relative mt-1 text-sm font-medium text-slate-300">
          <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
            <span className="block truncate">Filter By: Type</span>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-slate-800 py-1">
            {TYPE_FILTERS.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className="flex h-9 items-center gap-2 rounded-lg px-3 hover:cursor-default hover:bg-slate-700"
              >
                {({ selected }) => (
                  <>
                    <input
                      type="checkbox"
                      checked={selected}
                      className="h-3 w-3 rounded-sm border bg-transparent focus:border"
                      onChange={() => null}
                    />

                    {option}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <Listbox
        value={filters.dateFilter}
        onChange={(dateFilter) => dispatch({ type: 'dateFilter', payload: dateFilter })}
      >
        <div className="relative mt-1 text-sm font-medium text-slate-300">
          <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
            <span className="block truncate">Filter By: {filters.dateFilter}</span>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full rounded-lg bg-slate-800 py-1">
            {DATE_FILTERS.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className="flex h-9 items-center rounded-lg px-3 hover:cursor-default hover:bg-slate-700"
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}
