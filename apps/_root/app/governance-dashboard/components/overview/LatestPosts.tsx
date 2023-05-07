'use client'

import { classNames } from '@sushiswap/ui'
import React, { useReducer } from 'react'
import { SwiperSlide } from 'swiper/react'

import { GOV_STATUS, GovernanceItem } from '../../lib'
import { CardNavigation } from '../CardNavigation'
import { FilterButton } from '../FilterButton'
import { GovernanceItemCard } from '../GovernanceItemCard'

const DATE_FILTERS = ['Last Month', 'Last Quarter', 'Last Year'] as const // TODO: probably query filters and use as params
type DateFilter = (typeof DATE_FILTERS)[number]
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

export function LatestPosts({ posts }: { posts: Record<GovernanceStatus, GovernanceItem[]> }) {
  const [filters, dispatch] = useReducer(reducer, INITIAL_FILTERS)

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Latest @ Sushi</h2>
        <div className="flex gap-2">
          {DATE_FILTERS.map((filter) => (
            <FilterButton
              isActive={filters.date === filter}
              key={filter}
              onClick={() => dispatch({ type: 'date', payload: filter })}
            >
              {filter}
            </FilterButton>
          ))}
        </div>
      </div>
      <div className="grid w-full grid-cols-[1fr,2fr] gap-6">
        <div>
          {Object.entries(GOV_STATUS).map(([key, status], i) => (
            <div
              className={classNames(
                'relative rounded-t-2xl hover:cursor-pointer',
                filters.govStatus === key
                  ? 'bg-gradient-to-r from-[#0993EC] to-[#F338C3] px-0.5 pt-0.5'
                  : 'eae-in-out transition-transform hover:-translate-y-1',
                i && '-mt-4'
              )}
              key={key}
              onClick={() => dispatch({ type: 'govStatus', payload: key as GovernanceStatus })}
              style={{ zIndex: i + 1 }}
            >
              <div className="flex items-center justify-between gap-10 rounded-t-2xl bg-gradient-to-b from-[#212939] to-[#101728] px-5 py-5 pb-10">
                <div className="flex items-center gap-2">
                  <div className={classNames('h-3 w-3 rounded-sm', status.color)} />
                  <span className="font-medium">{status.title}</span>
                </div>
                <div className="flex h-6 w-10 items-center justify-center rounded-lg bg-slate-500/60 text-xs font-semibold text-white">
                  {posts[key].length}
                </div>
              </div>
            </div>
          ))}
        </div>
        {Object.keys(posts).map(
          (key) =>
            key === filters.govStatus && (
              <CardNavigation
                key={key}
                slidesPerView={2}
                spaceBetween={12}
                containerStyle="p-1"
                itemCount={posts[key].length}
              >
                {posts[key].map((item: GovernanceItem, index: number) => (
                  <SwiperSlide key={index}>
                    <GovernanceItemCard {...item} />
                  </SwiperSlide>
                ))}
              </CardNavigation>
            )
        )}
      </div>
    </section>
  )
}
