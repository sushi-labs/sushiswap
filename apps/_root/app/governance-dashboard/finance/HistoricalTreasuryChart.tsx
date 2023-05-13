'use client'

import React from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { formatNumber } from '../lib'

export function HistoricalTreasuryChart({
  treasuryHistoricalTvl,
}: {
  treasuryHistoricalTvl: { date: string; value: number }[]
}) {
  return (
    <div className="w-full text-xs">
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
            tick={{ fill: '#97A3B7' }}
          />
          <YAxis
            tickFormatter={(tick) => '$' + formatNumber(tick)}
            axisLine={false}
            tickLine={false}
            padding={{ bottom: 8 }}
            tick={{ fill: '#97A3B7' }}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <dl className="rounded bg-slate-700 p-3 shadow-md shadow-slate-800">
                  <dd className="text-base font-semibold text-slate-50">${formatNumber(payload[0].payload.value)}</dd>
                  <dt>
                    {new Date(label * 1000).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </dt>
                </dl>
              ) : null
            }
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
  )
}
