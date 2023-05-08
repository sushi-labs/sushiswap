'use client'

import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { CircleIcon } from '@sushiswap/ui'
import React from 'react'

import { KpiCard } from '../components'

const treasuryKpis = [
  {
    title: 'Treasury Runway',
    value: '13 months',
    additional: (
      // TODO: dynamic
      <div className="flex items-center gap-1 text-sm text-green-400">
        <CircleIcon width={8} className="fill-green-400 text-green-400" />
        Positive
      </div>
    ),
  },
  {
    title: 'Treasury Balance',
    value: '$20.1M',
    additional: (
      <div className="flex items-center gap-[14px]">
        <div className="flex items-baseline gap-3">
          <label className="text-sm text-slate-400">Liquid</label>
          <span className="font-bold">$17.9M</span>
        </div>
        <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
        <div className="flex items-baseline justify-end gap-3">
          <label className="text-sm text-slate-400">Vesting</label>
          <span className="font-bold">$2.2M</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Quarterly Budget / Burn Rate',
    value: '1M',
    additional: (
      // TODO: dynamic
      <dd className="text-sm text-red-400">-3.42% from last quarter</dd>
    ),
  },
]

const quarterlyKpis = [
  {
    title: 'Budget Left',
    value: <dd className="text-green-400">0.1M</dd>,
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

export default function Finance() {
  return (
    <div className="space-y-20">
      <section className="space-y-14">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-200">Treasury Overview</h2>
          <div className="grid grid-cols-[3fr,7fr] gap-4">
            <div className="grid gap-4">{treasuryKpis.map(KpiCard)}</div>
            <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
              <h3 className="text-sm text-slate-400">Treasury over time</h3>
              <p className="mt-3 text-xl font-semibold">$20.1M</p>
              <div className="mt-10 w-full bg-slate-700">chart</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
            <div className="flex items-center gap-[14px]">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-sm bg-[#BF60EE]" />
                <label className="text-sm text-slate-400">Expense</label>
              </div>
              <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-sm bg-blue" />
                <label className="text-sm text-slate-400">Revenue</label>
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Quarterly Expenses vs. Revenue</h3>
            <div className="mt-10 w-full bg-slate-700">chart</div>
          </div>
          <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
            <div className="flex items-center gap-[14px]">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-sm bg-[#BF60EE]" />
                <label className="text-sm text-slate-400">Outflow</label>
              </div>
              <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-sm bg-blue" />
                <label className="text-sm text-slate-400">Inflow</label>
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">Token Netflow</h3>
            <div className="mt-10 w-full bg-slate-700">chart</div>
          </div>
        </div>
        <div className="rounded-lg bg-[#1A2031]">
          <div className="h-full w-full border-b border-slate-800 px-5 pt-5 pb-7">
            <h3 className="mt-3 text-xl font-semibold">Treasury Snapshot</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Wallet Address: 0xe94B...F4f3</span>
              <ExternalLinkIcon className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div>table</div>
        </div>
      </section>
      <section className="mt-[120px] space-y-8">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-200">Quarterly Budget vs. Actuals</h2>
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
    </div>
  )
}
