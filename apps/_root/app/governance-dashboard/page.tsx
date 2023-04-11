'use client'

import { Tab } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import Container from '@sushiswap/ui/future/components/Container'
import React, { useReducer } from 'react'

import { CardNavigation, Hero } from './components'
import { SwiperSlide } from 'swiper/react'

const DATE_FILTERS = ['Last Month', 'Last Quarter', 'Last Year'] as const
type DateFilter = (typeof DATE_FILTERS)[number]

// const GOV_STATUS = ['Snapshot Vote', 'Proposal', 'Discussion']
// const GOV_STATUS = [
//   { title: 'Snapshot Vote', color: 'bg-red' },
//   { title: 'Proposal', color: 'bg-blue' },
//   { title: 'Discussion', color: 'bg-blue' },
// ]
const GOV_STATUS = {
  SNAPSHOT: { title: 'Snapshot Vote', color: 'bg-red' },
  PROPOSAL: { title: 'Proposal', color: 'bg-blue' },
  DISCUSSION: { title: 'Discussion', color: 'bg-blue' },
}
// type GovernanceStatus = (typeof GOV_STATUS)[number]['title']
type GovernanceStatus = keyof typeof GOV_STATUS

type DateDispatch = { type: 'date'; payload: DateFilter }
type GovStatusDispatch = { type: 'govStatus'; payload: GovernanceStatus }

const INITIAL_FILTERS = {
  date: 'Last Month',
  govStatus: 'SNAPSHOT',
}

function reducer(state: { date: string; govStatus: string }, { type, payload }: DateDispatch | GovStatusDispatch) {
  return {
    ...state,
    [type]: payload,
  }
}

const items = [
  {
    type: GOV_STATUS.SNAPSHOT,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
  },
  {
    type: GOV_STATUS.SNAPSHOT,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
  },
  {
    type: GOV_STATUS.SNAPSHOT,
    title: 'Sushi Vesting Merkle Tree Clawback',
    description:
      "This proposal’s expectation is to produce a community signal. Full details and discussions thus far can be found at: https://forum.sushi.com/t/sushi-vesting-merkle-tree-clawback-temp-check/10008 Synopsis: During the first 6 months of Sushi's liquidity mining a vest was put in place for 2/3rds of accrued Sushi rewards to be locked up and",
    isActive: true,
  },
]

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
                  {Object.entries(GOV_STATUS).map(([key, status], i) => (
                    <div
                      className={classNames(
                        'hover:cursor-pointer rounded-t-2xl relative',
                        filters.govStatus === key
                          ? 'bg-gradient-to-r from-[#0993EC] to-[#F338C3] pt-0.5 px-0.5'
                          : 'hover:-translate-y-1 transition-transform eae-in-out',
                        i && '-mt-4'
                      )}
                      key={key}
                      onClick={() => dispatch({ type: 'govStatus', payload: key as GovernanceStatus })}
                      style={{ zIndex: i + 1 }}
                    >
                      <div className="flex justify-between items-center px-5 py-5 pb-10 bg-gradient-to-b from-[#212939] to-[#101728] rounded-t-2xl gap-10">
                        <div className="flex items-center gap-2">
                          <div className={classNames('rounded-sm w-3 h-3', status.color)} />
                          <span className="font-medium">{status.title}</span>
                        </div>
                        <div className="h-6 w-10 flex items-center justify-center bg-slate-500/60 rounded-lg">2</div>
                      </div>
                    </div>
                  ))}
                </div>

                <CardNavigation slidesPerView={2} spaceBetween={12} containerStyle="p-1">
                  {items.map((item, index) => (
                    <SwiperSlide key={index} className="border border-slate-700/60 rounded-lg p-4 !h-fit">
                      <div className="flex gap-2 items-center">
                        <div className={classNames('rounded-sm w-2 h-2', item.type.color)} />
                        <span className="text-xs text-slate-400">{item.type.title}</span>
                      </div>
                      <h3 className="mt-2">{item.title}</h3>
                      <p className="mt-3 line-clamp-3 text-xs text-slate-500">{item.description}</p>
                      {item.isActive && (
                        <div className="mt-3 bg-[#243C2E] rounded-full px-2 h-6 flex items-center text-[#34D399] text-xs w-fit">
                          Active
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </CardNavigation>
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
