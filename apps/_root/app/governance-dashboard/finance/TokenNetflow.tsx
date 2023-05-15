import React from 'react'

import { TokenNetflowChart } from './TokenNetflowChart'

async function getTokenNetflowData() {
  const tokenNetflow = [
    {
      date: 'Aug 22',
      inflow: 1,
      outflow: 2,
    },
    {
      date: 'Sep 22',
      inflow: 1,
      outflow: 2,
    },
    {
      date: 'Oct 22',
      inflow: 1,
      outflow: 2,
    },
    {
      date: 'Nov 22',
      inflow: 2,
      outflow: 1,
    },
    {
      date: 'Dec 22',
      inflow: 1.2,
      outflow: 2.5,
    },
    {
      date: 'Jan 23',
      inflow: 2,
      outflow: 3,
    },
  ]
  return tokenNetflow
}

export async function TokenNetflow() {
  const tokenNetflowData = await getTokenNetflowData()

  return (
    <div className="h-full w-full rounded-lg bg-[#1A2031] p-5">
      <div className="flex items-center gap-[14px]">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-sm bg-[#BF60EE]" />
          <label className="text-sm text-slate-400">Outflow</label>
        </div>
        <div className="h-4 rounded-full border border-gray-50/20 bg-gray-50/20" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-sm bg-blue" />
          <label className="text-sm text-slate-400">Inflow</label>
        </div>
      </div>
      <h3 className="mt-3 text-xl font-semibold">Token Netflow</h3>
      <div className="mt-10 w-full text-xs">
        <TokenNetflowChart tokenNetflowData={tokenNetflowData} />
      </div>
    </div>
  )
}
