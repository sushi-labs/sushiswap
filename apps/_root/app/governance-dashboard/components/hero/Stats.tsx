import React from 'react'

import { formatNumber, getForumStats, getTokenHolders, getTreasurySnapshot } from '../../lib'
import { StatsBackground } from './StatsBackground'

export async function Stats() {
  const [tokenHolders, forumStats, treasurySnapshot] = await Promise.all([
    getTokenHolders(),
    getForumStats(),
    getTreasurySnapshot(),
  ])

  const userCount = tokenHolders?.sushi.userCount ?? '0'

  return (
    <div className="h-fit w-[350px] rounded-lg bg-gradient-to-b from-white/[4%] to-transparent p-px">
      <div className="relative overflow-hidden rounded-lg">
        <StatsBackground />
        <div className="relative h-full w-full space-y-10 rounded-lg bg-gradient-to-b from-[#101728]/40 to-transparent p-9">
          <section className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Treasury Balance</label>
              <p className="text-3xl font-bold">${formatNumber(treasurySnapshot.totalValueUsd)}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
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
          </section>
          <section className="space-y-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">Token Holders</label>
                <span className="text-2xl font-bold">{formatNumber(+userCount)}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <label className="text-sm text-slate-400">Total Proposal</label>
                <span className="text-2xl font-bold">{formatNumber(forumStats?.topic_count)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">Lifetime Participation</label>
                <span className="text-2xl font-bold">{formatNumber(forumStats?.user_count)}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <label className="text-sm text-slate-400">Events</label>
                <span className="text-2xl font-bold">24</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
