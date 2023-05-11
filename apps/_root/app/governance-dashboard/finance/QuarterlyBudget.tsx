'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import React from 'react'

import { KpiCard } from '../components'

const quarterlyKpis = [
  {
    title: 'Budget Left',
    value: <span className="text-green-400">0.1M</span>,
    additional: <dd className="text-sm text-slate-400">90% Used</dd>,
  },
  {
    title: 'Quarterly Budget',
    value: '$1M',
    additional: <dd className="text-sm text-slate-400">-3.42% from last quarter</dd>,
  },
  {
    title: 'Quarterly Budget / Burn Rate',
    value: '1M',
    additional: <dd className="text-sm text-slate-400">-3.42% from last quarter</dd>,
  },
]

export function QuarterlyBudget() {
  return (
    <section className="mt-[120px] space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="ml-1 text-2xl font-bold text-slate-200">Quarterly Budget vs. Actuals</h2>
        <div className="flex h-[42px] items-center gap-2 rounded-lg bg-slate-700 px-2">
          {/** TODO: add disabled and onclick */}
          <button className="rounded p-1 transition-colors ease-in-out enabled:hover:bg-black/[0.12] disabled:text-slate-500 enabled:hover:dark:bg-white/[0.12]">
            <ChevronLeftIcon className="h-3 w-3" strokeWidth={3} />
          </button>
          2022 Q3
          {/** TODO: add disabled and onclick */}
          <button className="rounded p-1 transition-colors ease-in-out enabled:hover:bg-black/[0.12] disabled:text-slate-500 enabled:hover:dark:bg-white/[0.12]">
            <ChevronRightIcon className="h-3 w-3" strokeWidth={3} />
          </button>
        </div>
      </header>
      <div className="grid grid-cols-[3fr,7fr] gap-4">
        <div className="grid gap-4">{quarterlyKpis.map(KpiCard)}</div>
        <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
          <h3 className="text-sm text-slate-400">Treasury over time</h3>
          <p className="mt-3 text-xl font-semibold">$20.1M</p>
          <div className="mt-10 w-full bg-slate-700">chart</div>
        </div>
      </div>
    </section>
  )
}
