'use client'

import { CircleIcon } from '@sushiswap/ui'
import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { KpiCard } from '../components'
import { formatNumber, TreasurySnapshot } from '../lib'
import { TreasuryBalancesTable } from './TreasuryBalancesTable'

export function TreasuryOverview(props: {
  treasurySnapshot: TreasurySnapshot
  treasuryHistoricalTvl: { date: string; value: number }[]
}) {
  const { treasurySnapshot, treasuryHistoricalTvl } = props

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
      value: '$' + formatNumber(treasurySnapshot.totalValueUsd),
      additional: (
        <div className="flex items-center gap-[14px]">
          <div className="flex items-baseline gap-3">
            <label className="text-sm text-slate-400">Liquid</label>
            <span className="font-bold">${formatNumber(treasurySnapshot.balancesValueUsd)}</span>
          </div>
          <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
          <div className="flex items-baseline justify-end gap-3">
            <label className="text-sm text-slate-400">Vesting</label>
            <span className="font-bold">${formatNumber(treasurySnapshot.vestingValueUsd)}</span>
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
  return (
    <section className="space-y-14">
      <div className="space-y-8">
        <h2 className="ml-1 text-2xl font-bold text-slate-200">Treasury Overview</h2>
        <div className="grid grid-cols-[3fr,7fr] gap-4">
          <div className="grid gap-4">{treasuryKpis.map(KpiCard)}</div>
          <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
            <h3 className="text-sm text-slate-400">Liquid treasury over time</h3>
            <p className="mt-3 text-xl font-semibold">${formatNumber(treasurySnapshot.balancesValueUsd)}</p>
            <div className="mt-10 w-full text-xs text-slate-400">
              <ResponsiveContainer minWidth="100%" minHeight={240}>
                <AreaChart
                  data={treasuryHistoricalTvl}
                  margin={{
                    right: 20,
                  }}
                >
                  <defs>
                    <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="13.14%" stopColor="#2C6DE2" />
                      <stop offset="100.2%" stopColor="#101728" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    tickFormatter={(date) =>
                      new Date(+date * 1000).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })
                    }
                    dataKey="date"
                    interval={30}
                    axisLine={false}
                    tickLine={false}
                    scale="band"
                  />
                  <YAxis
                    tickFormatter={(tick) => '$' + formatNumber(tick)}
                    axisLine={false}
                    tickLine={false}
                    padding={{ bottom: 8 }}
                  />
                  <Tooltip
                    content={(props) => {
                      const { active, payload, label } = props
                      if (active && payload?.length) {
                        return (
                          <dl className="rounded bg-slate-700 p-3 shadow-md shadow-slate-800">
                            <dd className="text-base font-semibold text-slate-50">
                              ${formatNumber(payload[0].payload.value)}
                            </dd>
                            <dt>
                              {new Date(label * 1000).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </dt>
                          </dl>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2C6DE2"
                    strokeWidth={4}
                    dot={false}
                    fill="url(#area-gradient)"
                    fillOpacity={0.33}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
      <TreasuryBalancesTable balances={treasurySnapshot.balances} />
    </section>
  )
}
