'use client'

import { Tab } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import Container from '@sushiswap/ui/future/components/Container'
import React, { useReducer } from 'react'

import { CardNavigation, Hero } from './components'

const DATE_FILTERS = ['Last Month', 'Last Quarter', 'Last Year'] as const
type DateFilter = (typeof DATE_FILTERS)[number]

const GOV_STATUS = ['Snapshot Vote', 'Proposal', 'Discussion']
type GovernanceStatus = (typeof GOV_STATUS)[number]

type DateDispatch = { type: 'date'; payload: DateFilter }
type GovStatusDispatch = { type: 'govStatus'; payload: GovernanceStatus }

const INITIAL_FILTERS = {
  date: 'Last Month',
  govStatus: 'Snapshot Vote',
}

function reducer(state: { date: string; govStatus: string }, { type, payload }: DateDispatch | GovStatusDispatch) {
  return {
    ...state,
    [type]: payload,
  }
}

const items = ['1', '2', '3', '4', '5']

export default function GovernanceDashboard() {
  const [filters, dispatch] = useReducer(reducer, INITIAL_FILTERS)

  return (
    <Tab.Group>
      <Hero />
      <Container maxWidth="6xl" className="pt-14 mx-auto px-4">
        <Tab.Panels>
          <Tab.Panel>
            <section className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Latest @ Sushi</h2>
                <div className="flex gap-2">
                  {DATE_FILTERS.map((filter) => (
                    <button
                      className={classNames(
                        'rounded-full h-10 px-4 ring-1 ring-slate-700/40',
                        filters.date === filter ? 'bg-slate-700/40' : 'hover:bg-slate-700/20'
                      )}
                      key={filter}
                      onClick={() => dispatch({ type: 'date', payload: filter })}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid w-full grid-cols-[1fr,2fr] gap-6">
                <div>
                  {GOV_STATUS.map((status, i) => (
                    <div
                      className={classNames(
                        'hover:cursor-pointer rounded-t-2xl relative',
                        filters.govStatus === status
                          ? 'bg-gradient-to-r from-[#0993EC] to-[#F338C3] pt-0.5 px-0.5'
                          : 'hover:-translate-y-1 transition-transform eae-in-out',
                        i && '-mt-4'
                      )}
                      key={status}
                      onClick={() => dispatch({ type: 'govStatus', payload: status })}
                      style={{ zIndex: i + 1 }}
                    >
                      <div className="flex justify-between items-center px-5 py-5 pb-10 bg-gradient-to-b from-[#212939] to-[#101728] rounded-t-2xl gap-10">
                        <div className="flex items-center gap-2">
                          <div
                            className={classNames(
                              'rounded-sm w-3 h-3',
                              !i ? 'bg-red' : i === 1 ? 'bg-yellow' : 'bg-blue'
                            )}
                          />
                          <span className="font-medium">{status}</span>
                        </div>
                        <div className="h-6 w-10 flex items-center justify-center bg-slate-500/60 rounded-lg">2</div>
                      </div>
                    </div>
                  ))}
                </div>

                <CardNavigation items={items} />
              </div>
            </section>
          </Tab.Panel>
          <Tab.Panel>2</Tab.Panel>
          <Tab.Panel>3</Tab.Panel>
          <Tab.Panel>4</Tab.Panel>
        </Tab.Panels>
      </Container>
    </Tab.Group>
  )
}
