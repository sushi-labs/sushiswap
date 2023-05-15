'use client'

import React from 'react'
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartTooltip } from '../components'
import { formatNumber } from '../lib'

// TODO: type
export function TokenNetflowChart(props) {
  const tokenNetflowData = props.tokenNetflowData.map((month) => ({ ...month, outflow: -month.outflow }))

  return (
    <ResponsiveContainer minWidth="100%" minHeight={240}>
      <BarChart data={tokenNetflowData} stackOffset="sign">
        <defs>
          <linearGradient id="inflow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#568AE8" />
            <stop offset="100.2%" stopColor="#1A2031" />
          </linearGradient>
          <linearGradient id="outflow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1A2031" stopOpacity={0.85} />
            <stop offset="100.2%" stopColor="#C662F5" />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#97A3B7' }} />
        <YAxis axisLine={false} tickLine={false} padding={{ bottom: 8 }} tick={{ fill: '#97A3B7' }} />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <ChartTooltip>
                <dl className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-blue" />
                  <dd className="text-base font-semibold text-slate-50">
                    ${formatNumber(Math.abs(payload[0].payload.outflow), 0)}
                  </dd>
                </dl>
                <dl className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-[#BF60EE]" />
                  <dd className="text-base font-semibold text-slate-50">
                    ${formatNumber(payload[0].payload.inflow, 0)}
                  </dd>
                </dl>
                <p className="mt-1">{label}</p>
              </ChartTooltip>
            ) : null
          }
        />
        <Bar barSize={24} dataKey="inflow" fill="url(#inflow)" stackId="stack" />
        <Bar barSize={24} dataKey="outflow" fill="url(#outflow)" stackId="stack" />
        <ReferenceLine isFront y={0} stroke="#97A3B7" strokeDasharray="5 5" opacity={0.1} />
      </BarChart>
    </ResponsiveContainer>
  )
}
