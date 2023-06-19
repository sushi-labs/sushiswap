import React from 'react'

import { formatNumber, getForumStats, getPercentageDiff, getHolderSnapshot } from '../lib'
import { InfoIconTooltip } from './InfoIconTooltip'
import { KpiCard } from './KpiCard'

export async function HolderSnapshot() {
  const [holderSnapshot, forumStats] = await Promise.all([getHolderSnapshot(), getForumStats()])
  const tokenConcentrationDiff = getPercentageDiff(
    holderSnapshot.tokenConcentration,
    holderSnapshot.previousQuarterTokenConcentration
  )
  const userCountDiff = getPercentageDiff(holderSnapshot.userCount, holderSnapshot.previousQuarterUserCount)

  const holderSnapshotInfo = [
    {
      title: 'Community Participants',
      value: (
        <div className="grid grid-cols-3">
          <span>{formatNumber(forumStats?.user_count)}</span>
          <span>{formatNumber(forumStats?.active_users_30_days)}</span>
          <span>{formatNumber(forumStats?.active_users_7_days)}</span>
        </div>
      ),
      additional: (
        <div className="grid grid-cols-3 text-sm text-slate-400 dark:text-slate-500">
          <span>Total</span>
          <span>Last 30 days</span>
          <span>Last 7 days</span>
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
      value: holderSnapshot.tokenConcentration.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 }),
      additional: (
        <dd className={`text-sm ${tokenConcentrationDiff < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {tokenConcentrationDiff.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 })} from last
          quarter
        </dd>
      ),
    },
    {
      title: 'Token Holders',
      value: formatNumber(+holderSnapshot.userCount),
      additional: (
        <dd className={`text-sm ${userCountDiff < 0 ? 'text-red-400' : 'text-green-400'}`}>
          {userCountDiff.toLocaleString('EN', { style: 'percent', maximumFractionDigits: 2 })} from last quarter
        </dd>
      ),
    },
  ]

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold dark:text-slate-200">Holder Snapshot</h2>
      <div className="grid gap-4 md:grid-cols-3">{holderSnapshotInfo.map(KpiCard)}</div>
    </section>
  )
}
