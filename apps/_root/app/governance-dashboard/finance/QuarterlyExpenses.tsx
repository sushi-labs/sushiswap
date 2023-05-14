'use client'

import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../lib'
import { ChartTooltip } from '../components'

export function QuarterlyExpenses({ budgetData }) {
  // TODO: type
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
          <BarChart data={budgetData}>
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
                  <ChartTooltip>
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
                  </ChartTooltip>
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
