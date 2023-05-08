import React from 'react'

import { formatNumber, getForumStats, getTokenHolders } from '../lib'
import { KpiCard } from './KpiCard'

export async function HolderSnapshot() {
  const [tokenHolders, forumStats] = await Promise.all([getTokenHolders(), getForumStats()])
  const userCount = tokenHolders?.sushi.userCount ?? '0'

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
        <div className="grid grid-cols-3 text-xs text-slate-500">
          <span>Total</span>
          <span>Last 7 days</span>
          <span>Last 30 days</span>
        </div>
      ),
    },
    {
      title: 'Token Concentration',
      value: '20.12%',
      // additional: <dd className="text-sm text-green-400">+33.42% from last quarter</dd>,
    },
    {
      title: 'Token Holders',
      value: formatNumber(+userCount),
      // additional: (
      //   // TODO: dynamic
      //   <dd className="text-sm text-red-400">-3.42% from last quarter</dd>
      // ),
    },
  ]

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-200">Holder Snapshot</h2>
      <div className="grid grid-cols-3 gap-4">
        {/** TODO: mobile */}
        {holderSnapshot.map(KpiCard)}
      </div>
    </section>
  )
}
