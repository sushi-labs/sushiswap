import { Container } from '@sushiswap/ui'
import React from 'react'
import { StatsBackground } from './StatsBackground'

export function Stats() {
  return (
    <div className="bg-gradient-to-b from-white/[4%] to-transparent rounded-lg p-px h-fit w-[350px]">
      <div className="relative overflow-hidden rounded-lg">
        <StatsBackground />
        <Container className="p-9 relative space-y-10 w-full h-full bg-gradient-to-b from-[#101728]/40 to-transparent rounded-lg">
          <section className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm">Treasury Balance</label>
              <p className="font-bold text-3xl">$20.1M</p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-3 items-baseline">
                <label className="text-slate-400 text-sm">Liquid</label>
                <span className="font-bold">$17.9M</span>
              </div>
              <div className="bg-gray-50/20 rounded-full border border-gray-50/20 h-4" />
              <div className="flex gap-3 items-baseline justify-end">
                <label className="text-slate-400 text-sm">Vesting</label>
                <span className="font-bold">$2.2M</span>
              </div>
            </div>
          </section>
          <section className="space-y-5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-sm">Token Holders</label>
                <span className="font-bold text-2xl">23.4k</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <label className="text-slate-400 text-sm">Total Proposal</label>
                <span className="font-bold text-2xl">109</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400 text-sm">Lifetime Participation</label>
                <span className="font-bold text-2xl">12.3k</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <label className="text-slate-400 text-sm">Events</label>
                <span className="font-bold text-2xl">24</span>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </div>
  )
}
