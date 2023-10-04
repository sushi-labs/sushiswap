'use client'

import {formatNumber} from 'sushi'
import useSWR from 'swr'

import {getBentoBoxKpis} from '../lib'

// const stats = [
//   { name: 'Total Subscribers', value: '71,897' },
//   { name: 'Avg. Open Rate', value: '58.16%' },
//   { name: 'Avg. Click Rate', value: '24.57%' },
// ]

interface KpiProps {
  kpi: { name: string; value: number }
}

function Kpi({ kpi }: KpiProps) {
  return (
    <div key={kpi.name} className="px-4 py-5 overflow-hidden rounded-lg shadow bg-slate-700 sm:p-6">
      <dt className="text-sm font-medium truncate text-slate-200">{kpi.name}</dt>
      <dd className="mt-1 text-3xl font-semibold text-white">{formatNumber(kpi.value)}</dd>
    </div>
  )
}

export function BentoBoxKpis() {
  const { data: kpis } = useSWR('bentobox-kpis', () => getBentoBoxKpis())

  return (
    <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
      {kpis?.map((kpi) => (
        <Kpi key={kpi.name} kpi={kpi} />
      ))}
    </dl>
  )
}
