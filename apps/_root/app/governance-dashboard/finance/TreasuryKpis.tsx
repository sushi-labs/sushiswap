'use client'

import { CircleIcon } from '@sushiswap/ui'
import React from 'react'

import { KpiCard } from '../components'
import { formatNumber } from '../lib'

export function TreasuryKpis({
  treasurySnapshot,
}: {
  treasurySnapshot: { totalValueUsd: number; balancesValueUsd: number; vestingValueUsd: number }
}) {
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
        <div className="flex items-center gap-[14px] text-sm">
          <div className="flex items-baseline gap-3">
            <label className="text-slate-400">Liquid</label>
            <span className="font-bold">${formatNumber(treasurySnapshot.balancesValueUsd)}</span>
          </div>
          <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
          <div className="flex items-baseline justify-end gap-3">
            <label className="text-slate-400">Vesting</label>
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

  return <div className="grid gap-4">{treasuryKpis.map(KpiCard)}</div>
}
