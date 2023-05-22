'use client'

import { classNames } from '@sushiswap/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'

import { DATE_FILTERS, GOV_STATUS, GovernanceItem, GovernanceStatus } from '../../lib'
import { CardNavigation } from '../CardNavigation'
import { FilterButton } from '../FilterButton'
import { GovernanceItemCard } from '../GovernanceItemCard'

export function LatestPosts({ posts }: { posts: Record<GovernanceStatus, GovernanceItem[]> }) {
  const [selectedGovType, setSelectedGovType] = useState<GovernanceStatus>('IMPLEMENTATION')
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  function filterDate(filterKey: string) {
    params.set(DATE_FILTERS.key, filterKey)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Latest @ Sushi</h2>
        <div className="flex gap-2">
          {DATE_FILTERS.options.map((filter) => (
            <FilterButton
              isActive={(params.get(DATE_FILTERS.key) ?? 'all') === filter.key}
              key={filter.key}
              onClick={() => filterDate(filter.key)}
            >
              {filter.title}
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
                selectedGovType === key
                  ? 'bg-gradient-to-r from-[#0993EC] to-[#F338C3] px-0.5 pt-0.5'
                  : 'eae-in-out transition-transform hover:-translate-y-1',
                i && '-mt-4'
              )}
              key={key}
              onClick={() => setSelectedGovType(key as GovernanceStatus)}
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
            key === selectedGovType &&
            (posts[key].length ? (
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
            ) : (
              <i className="font-medium text-slate-300">No posts found with the current filters</i>
            ))
        )}
      </div>
    </section>
  )
}
