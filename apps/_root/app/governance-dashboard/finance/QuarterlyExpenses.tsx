'use client'

import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../lib'

const data = [
  {
    quarter: 'Jan 22',
    expenses: 1,
    revenue: 2.2,
  },
  {
    quarter: 'Apr 22',
    expenses: 2,
    revenue: 3,
  },
  {
    quarter: 'Jul 22',
    expenses: 1,
    revenue: 2.5,
  },
  {
    quarter: 'Oct 22',
    expenses: 1.8,
    revenue: 2,
  },
  {
    quarter: 'Jan 23',
    expenses: 2,
    revenue: 3,
  },
  {
    quarter: 'Apr 23',
    expenses: 1.2,
    revenue: 2,
  },
]

export function QuarterlyExpenses() {
  return (
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
      <div className="mt-10 w-full text-xs">
        <ResponsiveContainer minWidth="100%" minHeight={240}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="expenses" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C662F5" />
                <stop offset="100.2%" stopColor="#1A2031" />
              </linearGradient>
              <linearGradient id="revenue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#568AE8" />
                <stop offset="100.2%" stopColor="#1A2031" />
              </linearGradient>
            </defs>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded bg-slate-700 p-3 shadow-md shadow-slate-800">
                    <dl className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-[#BF60EE]" />
                      <dd className="text-base font-semibold text-slate-50">
                        ${formatNumber(payload[0].payload.expenses, 0)}
                      </dd>
                    </dl>
                    <dl className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm bg-blue" />
                      <dd className="text-base font-semibold text-slate-50">
                        ${formatNumber(payload[0].payload.revenue, 0)}
                      </dd>
                    </dl>
                    <p className="mt-1">{label}</p>
                  </div>
                ) : null
              }
            />
            <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: '#97A3B7' }} />
            <YAxis axisLine={false} tickLine={false} padding={{ bottom: 8 }} tick={{ fill: '#97A3B7' }} />
            <Bar dataKey="expenses" fill="url(#expenses)" radius={20} barSize={12} />
            <Bar dataKey="revenue" fill="url(#revenue)" radius={20} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
