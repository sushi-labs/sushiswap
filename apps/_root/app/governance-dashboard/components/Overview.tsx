import { classNames } from '@sushiswap/ui'
import React, { useReducer } from 'react'
import { SwiperSlide } from 'swiper/react'

import { CardNavigation } from './CardNavigation'
import { EventItemCard } from './EventItem'
import { GovernanceItemCard } from './GovernanceItemCard'
import { KpiCard } from './KpiCard'

const DATE_FILTERS = ['Last Month', 'Last Quarter', 'Last Year'] as const
type DateFilter = (typeof DATE_FILTERS)[number]

const GOV_STATUS = {
  IMPLEMENTATION: {
    id: 'IMPLEMENTATION',
    title: 'Implementation Vote',
    color: 'bg-red',
  },
  PROPOSAL: {
    id: 'PROPOSAL',
    title: 'Proposal Vote',
    color: 'bg-yellow',
  },
  DISCUSSION: {
    id: 'DISCUSSION',
    title: 'Discussions',
    color: 'bg-blue',
  },
}

type GovernanceStatus = keyof typeof GOV_STATUS

type DateDispatch = { type: 'date'; payload: DateFilter }
type GovStatusDispatch = { type: 'govStatus'; payload: GovernanceStatus }

const INITIAL_FILTERS = {
  date: 'Last Month',
  govStatus: 'IMPLEMENTATION',
}

function reducer(state: { date: string; govStatus: string }, { type, payload }: DateDispatch | GovStatusDispatch) {
  return {
    ...state,
    [type]: payload,
  }
}

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
]

const events = [
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'San Francisco, USA',
  },
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'Online',
  },
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'San Francisco, USA',
  },
]

const kpis = [
  {
    title: 'Community Participants',
    value: '20.12k',
    additional: (
      <dd className="text-green-400 text-sm">
        {/** TODO: dynamic text color */}
        +33.42% from last quarter
      </dd>
    ),
  },
  {
    title: 'Community Participants',
    value: '20.12k',
    additional: (
      <dd className="text-green-400 text-sm">
        {/** TODO: dynamic text color */}
        +33.42% from last quarter
      </dd>
    ),
  },
  {
    title: 'Community Participants',
    value: '20.12k',
    additional: (
      <dd className="text-green-400 text-sm">
        {/** TODO: dynamic text color */}
        +33.42% from last quarter
      </dd>
    ),
  },
]

export function Overview() {
  const [filters, dispatch] = useReducer(reducer, INITIAL_FILTERS)
  // TODO: filter on date
  const items = governanceItems.filter((item) => item.type.id === filters.govStatus)

  return (
    <div className="space-y-20">
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-slate-200 font-bold text-2xl">Latest @ Sushi</h2>
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
          <CardNavigation slidesPerView={2} spaceBetween={12} containerStyle="p-1" itemCount={items.length}>
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <GovernanceItemCard {...item} />
              </SwiperSlide>
            ))}
          </CardNavigation>
        </div>
      </section>
      <section className="space-y-8">
        <h2 className="font-bold text-2xl text-slate-200">Holder Snapshot</h2>
        <div className="grid gap-4 grid-cols-3">
          {/** TODO: mobile */}
          {kpis.map(KpiCard)}
        </div>
      </section>
      <section className="space-y-8">
        <h2 className="flex justify-center font-bold text-2xl text-slate-200">Upcoming Events</h2>
        <CardNavigation slidesPerView={3} spaceBetween={24} itemCount={events.length}>
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <EventItemCard {...event} />
            </SwiperSlide>
          ))}
        </CardNavigation>
      </section>
    </div>
  )
}
