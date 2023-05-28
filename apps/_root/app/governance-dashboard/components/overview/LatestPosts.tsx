'use client'

import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'

import { DATE_FILTERS, GOV_STATUS, GovernanceItem, GovernanceStatus } from '../../lib'
import { CardNavigation } from '../CardNavigation'
import { FilterButton } from '../FilterButton'
import { GovernanceItemCard } from '../GovernanceItemCard'
import { useBreakpoint } from '@sushiswap/ui/future/lib'

export function LatestPosts({ posts }: { posts: Record<GovernanceStatus, GovernanceItem[]> }) {
  const [selectedGovType, setSelectedGovType] = useState<GovernanceStatus>('IMPLEMENTATION')
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { isMd } = useBreakpoint('md')

  function filterDate(filterKey: string) {
    params.set(DATE_FILTERS.key, filterKey)
    replace(`${pathname}?${params.toString()}`)
  }

  const selectedFilter =
    DATE_FILTERS.options.find((f) => f.key === params.get(DATE_FILTERS.key)) ?? DATE_FILTERS.options[3]

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="pl-1 text-2xl font-bold text-slate-200">Latest @ Sushi</h2>

          <Listbox value={selectedFilter} onChange={(filter) => filterDate(filter.key)}>
            {({ open }) => (
              <div className="relative md:hidden">
                <Listbox.Button className="flex h-10 w-full min-w-[150px] items-center justify-between rounded-lg bg-slate-800 px-3">
                  {selectedFilter.title}
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0')}
                  />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 px-1 py-2">
                  {DATE_FILTERS.options.map((filter) => (
                    <Listbox.Option
                      key={filter.key}
                      value={filter}
                      className="rounded-lg px-2 py-1 hover:cursor-default hover:bg-slate-700"
                    >
                      {filter.title}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            )}
          </Listbox>

          <div className="hidden gap-2 md:flex">
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

        <Listbox value={selectedGovType} onChange={setSelectedGovType}>
          {({ open }) => (
            <div className="relative md:hidden">
              <Listbox.Button className="flex h-10 w-full items-center justify-between rounded-lg bg-slate-800 px-3">
                <div className="flex items-center gap-2">
                  <div className={classNames('h-3 w-3 rounded-sm', GOV_STATUS[selectedGovType].color)} />
                  {GOV_STATUS[selectedGovType].title}
                </div>
                <ChevronDownIcon
                  width={24}
                  height={24}
                  className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0')}
                />
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full rounded-lg bg-slate-800 p-1">
                {Object.entries(GOV_STATUS).map(([key, status]) => (
                  <Listbox.Option
                    key={key}
                    value={status.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 hover:cursor-default hover:bg-slate-700"
                  >
                    <div className={classNames('h-3 w-3 rounded-sm', status.color)} />
                    {status.title}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>
      </div>

      <div className="grid w-full gap-6 md:grid-cols-[1fr,2fr]">
        <div className="hidden md:block">
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
                slidesPerView={isMd ? 2 : 1}
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
              <i key={key} className="font-medium text-slate-300">
                No posts found with the current filters
              </i>
            ))
        )}
      </div>
    </section>
  )
}
