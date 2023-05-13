import React from 'react'

import { getTreasurySnapshot } from '../lib'
import { QuarterlyBudget } from './QuarterlyBudget'
import { QuarterlyExpenses } from './QuarterlyExpenses'
import { TreasuryBalancesTable } from './TreasuryBalancesTable'
import { TreasuryKpis } from './TreasuryKpis'
import { HistoricalTreasury } from './HistoricalTreasury'

async function getBudgetData() {
  const budgetData = [
    {
      quarter: 'Jan 22',
      expenses: 1,
      revenue: 2.2,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
    {
      quarter: 'Apr 22',
      expenses: 2,
      revenue: 3,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
    {
      quarter: 'Jul 22',
      expenses: 1,
      revenue: 2.5,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
    {
      quarter: 'Oct 22',
      expenses: 1.8,
      revenue: 2,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
    {
      quarter: 'Jan 23',
      expenses: 2,
      revenue: 3,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
    {
      quarter: 'Apr 23',
      expenses: 1.2,
      revenue: 2,
      budget: 9,
      expensesBreakdown: [
        {
          teamKey: 'engineering',
          teamName: 'Engineering',
          expense: 2,
        },
        {
          teamKey: 'bd',
          teamName: 'BD Operations',
          expense: 2,
        },
        {
          teamKey: 'marketing',
          teamName: 'Marketing',
          expense: 1,
        },
        {
          teamKey: 'design',
          teamName: 'Design',
          expense: 1,
        },
        {
          teamKey: 'others',
          teamName: 'Others',
          expense: 2,
        },
        {
          teamKey: 'available',
          teamName: 'Available Budget',
          expense: 1,
        },
      ],
      left: 1,
    },
  ]

  return budgetData
}

export default async function Finance() {
  const [treasurySnapshot, budgetData] = await Promise.all([getTreasurySnapshot(), getBudgetData()])

  return (
    <div className="space-y-20">
      <section className="space-y-14">
        <div className="space-y-8">
          <h2 className="ml-1 text-2xl font-bold text-slate-200">Treasury Overview</h2>
          <div className="grid grid-cols-[3fr,7fr] gap-4">
            <TreasuryKpis treasurySnapshot={treasurySnapshot} budgetData={budgetData} />
            {/* @ts-expect-error Async Server Component */}
            <HistoricalTreasury treasuryLiquidBalance={treasurySnapshot.balancesValueUsd} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <QuarterlyExpenses budgetData={budgetData} />
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
            <div className="mt-10 w-full bg-slate-700">chart</div>
          </div>
        </div>
        <TreasuryBalancesTable balances={treasurySnapshot.balances} />
      </section>
      {budgetData.length ? <QuarterlyBudget budgetData={budgetData} /> : null}
    </div>
  )
}
