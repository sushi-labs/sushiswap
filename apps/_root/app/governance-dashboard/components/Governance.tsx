'use client'

import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import React, { useReducer } from 'react'

import { GovernanceItem } from '../lib'
import { GOV_STATUS } from '../lib/constants'
import { GovernanceItemCard } from './GovernanceItemCard'

type GovernanceStatus = keyof typeof GOV_STATUS
const governanceItems = [
  {
    type: GOV_STATUS.IMPLEMENTATION,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
    date: 123123123,
  },
  {
    type: GOV_STATUS.IMPLEMENTATION,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
    date: 123123123,
  },
  {
    type: GOV_STATUS.DISCUSSION,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
    date: 123123123,
  },
  {
    type: GOV_STATUS.DISCUSSION,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
    date: 123123123,
  },
  {
    type: GOV_STATUS.PROPOSAL,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
    date: 123123123,
  },
]

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

export function Governance() {
  const [filters, dispatch] = useReducer(reducer, INITIAL_FILTERS)

  const governanceItemsMapping = governanceItems.reduce(
    (acc: Record<GovernanceStatus, GovernanceItem[]>, curr) => {
      acc[curr.type.id].push(curr)
      return acc
    },
    {
      IMPLEMENTATION: [],
      PROPOSAL: [],
      DISCUSSION: [],
    }
  )

  console.log('governanceItemsMapping', governanceItemsMapping)

  return (
    <section className="space-y-10">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Governance Board</h2>
        <div className="flex gap-2">
          <Listbox value={filters.sortBy} onChange={(sortBy) => dispatch({ type: 'sortBy', payload: sortBy })}>
            <div className="relative mt-1 text-sm font-medium text-slate-300">
              <Listbox.Button className="relative flex h-[42px] w-full items-center gap-2 rounded-lg bg-slate-800 px-3 text-left">
                <span className="block truncate">Sort By: {filters.sortBy}</span>
                <ChevronDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-slate-800 py-1">
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
              <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-slate-800 py-1">
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
              <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-slate-800 py-1">
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
      </header>
      <div className="grid grid-cols-3 gap-12">
        {Object.entries(governanceItemsMapping).map(([key, items]) => {
          return (
            <div key={key} className="space-y-5">
              <div className="flex items-center gap-2 pl-2.5">
                <div className={classNames('h-3 w-3 rounded-sm', GOV_STATUS[key].color)} />
                <h3 className="font-medium">{GOV_STATUS[key].title}</h3>
              </div>

              <div className="grid gap-2">
                {items.map((item, index) => (
                  <GovernanceItemCard key={index} {...item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
