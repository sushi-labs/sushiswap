import React from 'react'

import { formatNumber, getForumStats, getPercentageDiff, getTokenHolders } from '../lib'
import { KpiCard } from './KpiCard'
import { InfoIconTooltip } from './InfoIconTooltip'

export async function HolderSnapshot() {
  const [tokenHolders, forumStats] = await Promise.all([getTokenHolders(), getForumStats()])
  const tokenConcentrationDiff = getPercentageDiff(
    tokenHolders.tokenConcentration,
    tokenHolders.previousQuarter.tokenConcentration
  )
  const userCountDiff = getPercentageDiff(tokenHolders.userCount, tokenHolders.previousQuarter.userCount)

  const holderSnapshot = [
    {
      title: 'Community Participants',
      value: (
        <div className="grid grid-cols-3">
          <span>{formatNumber(forumStats?.user_count)}</span>
          <span>{formatNumber(forumStats?.active_users_7_days)}</span>
          <span>{formatNumber(forumStats?.active_users_30_days)}</span>
        </div>
      ),
      additional: (
        <div className="grid grid-cols-3 text-sm text-slate-500">
          <span>Total</span>
          <span>Last 7 days</span>
          <span>Last 30 days</span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>Token Concentration</span>
          <InfoIconTooltip description="Percentage of $SUSHI held by top 10 addresses" />
        </div>
      ),
      value: tokenHolders.tokenConcentration.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 }),
      additional: (
        <dd className={`text-sm ${tokenConcentrationDiff < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {tokenConcentrationDiff.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 })} from last
          quarter
        </dd>
      ),
    },
    {
      title: 'Token Holders',
      value: formatNumber(+tokenHolders.userCount),
      additional: (
        <dd className={`text-sm ${userCountDiff < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {userCountDiff.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 })} from last quarter
        </dd>
      ),
    },
  ]

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-200">Holder Snapshot</h2>
      <div className="grid gap-4 md:grid-cols-3">{holderSnapshot.map(KpiCard)}</div>
    </section>
  )
}
