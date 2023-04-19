import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { CircleIcon } from '@sushiswap/ui'
import React from 'react'

import { KpiCard } from './KpiCard'

const treasuryKpis = [
  {
    title: 'Treasury Runway',
    value: '13 months',
    additional: (
      // TODO: dynamic
      <div className="flex gap-1 items-center text-green-400 text-sm">
        <CircleIcon width={8} className="text-green-400 fill-green-400" />
        Positive
      </div>
    ),
  },
  {
    title: 'Treasury Balance',
    value: '$20.1M',
    additional: (
      <div className="flex items-center gap-[14px]">
        <div className="flex gap-3 items-baseline">
          <label className="text-slate-400 text-sm">Liquid</label>
          <span className="font-bold">$17.9M</span>
        </div>
        <div className="bg-gray-50/20 rounded-full border border-gray-50/20 h-4" />
        <div className="flex gap-3 items-baseline justify-end">
          <label className="text-slate-400 text-sm">Vesting</label>
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
      <dd className="text-red-400 text-sm">-3.42% from last quarter</dd>
    ),
  },
]

const quarterlyKpis = [
  {
    title: 'Budget Left',
    value: <dd className="text-green-400">0.1M</dd>,
    additional: <dd className="text-slate-400 text-sm">90% Used</dd>,
  },
  {
    title: 'Quarterly Budget',
    value: '$1M',
    additional: <dd className="text-slate-400 text-sm">-3.42% from last quarter</dd>,
  },
  {
    title: 'Quarterly Budget / Burn Rate',
    value: '1M',
    additional: <dd className="text-slate-400 text-sm">-3.42% from last quarter</dd>,
  },
]

export function Finance() {
  return (
    <div className="space-y-20">
      <section className="space-y-14">
        <div className="space-y-8">
          <h2 className="font-bold text-2xl text-slate-200">Treasury Overview</h2>
          <div className="grid grid-cols-[3fr,7fr] gap-4">
            <div className="grid gap-4">{treasuryKpis.map(KpiCard)}</div>
            <div className="rounded-lg w-full h-full p-5 bg-[#1A2031]">
              <h3 className="text-slate-400 text-sm">Treasury over time</h3>
              <p className="mt-3 text-xl font-semibold">$20.1M</p>
              <div className="bg-slate-700 w-full mt-10">chart</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg w-full h-full p-5 bg-[#1A2031]">
            <div className="flex items-center gap-[14px]">
              <div className="flex gap-3 items-center">
                <div className="rounded-sm w-3 h-3 bg-[#BF60EE]" />
                <label className="text-slate-400 text-sm">Expense</label>
              </div>
              <div className="bg-gray-50/20 rounded-full border border-gray-50/20 h-4" />
              <div className="flex gap-3 items-center">
                <div className="rounded-sm w-3 h-3 bg-blue" />
                <label className="text-slate-400 text-sm">Revenue</label>
              </div>
            </div>
            <h3 className="font-semibold text-xl mt-3">Quarterly Expenses vs. Revenue</h3>
            <div className="bg-slate-700 w-full mt-10">chart</div>
          </div>
          <div className="rounded-lg w-full h-full p-5 bg-[#1A2031]">
            <div className="flex items-center gap-[14px]">
              <div className="flex gap-3 items-center">
                <div className="rounded-sm w-3 h-3 bg-[#BF60EE]" />
                <label className="text-slate-400 text-sm">Outflow</label>
              </div>
              <div className="bg-gray-50/20 rounded-full border border-gray-50/20 h-4" />
              <div className="flex gap-3 items-center">
                <div className="rounded-sm w-3 h-3 bg-blue" />
                <label className="text-slate-400 text-sm">Inflow</label>
              </div>
            </div>
            <h3 className="font-semibold text-xl mt-3">Token Netflow</h3>
            <div className="bg-slate-700 w-full mt-10">chart</div>
          </div>
        </div>
        <div className="rounded-lg bg-[#1A2031]">
          <div className="w-full h-full pt-5 pb-7 px-5 border-b border-slate-800">
            <h3 className="font-semibold text-xl mt-3">Treasury Snapshot</h3>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Wallet Address: 0xe94B...F4f3</span>
              <ExternalLinkIcon className="text-slate-400 w-4 h-4" />
            </div>
          </div>
          <div>table</div>
        </div>
      </section>
      <section className="mt-[120px] space-y-8">
        <header className="flex items-center justify-between">
          <h2 className="font-bold text-2xl text-slate-200">Quarterly Budget vs. Actuals</h2>
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-2 h-[42px]">
            {/** TODO: add disabled and onclick */}
            <button className="disabled:text-slate-500 enabled:hover:bg-black/[0.12] enabled:hover:dark:bg-white/[0.12] p-1 rounded transition-colors ease-in-out">
              <ChevronLeftIcon className="w-3 h-3" strokeWidth={3} />
            </button>
            2022 Q3
            {/** TODO: add disabled and onclick */}
            <button className="disabled:text-slate-500 enabled:hover:bg-black/[0.12] enabled:hover:dark:bg-white/[0.12] p-1 rounded transition-colors ease-in-out">
              <ChevronRightIcon className="w-3 h-3" strokeWidth={3} />
            </button>
          </div>
        </header>
        <div className="grid grid-cols-[3fr,7fr] gap-4">
          <div className="grid gap-4">{quarterlyKpis.map(KpiCard)}</div>
          <div className="rounded-lg w-full h-full p-5 bg-[#1A2031]">
            <h3 className="text-slate-400 text-sm">Treasury over time</h3>
            <p className="mt-3 text-xl font-semibold">$20.1M</p>
            <div className="bg-slate-700 w-full mt-10">chart</div>
          </div>
        </div>
      </section>
    </div>
  )
}
