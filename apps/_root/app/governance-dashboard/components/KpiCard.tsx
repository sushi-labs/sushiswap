import React, { ReactNode } from 'react'

interface Kpi {
  title: string
  value: string
  additional: ReactNode
}

export function KpiCard(props: Kpi) {
  const { title, value, additional } = props
  return (
    <dl className="bg-slate-800 rounded-lg p-5">
      <dt className="text-slate-400 text-sm">{title}</dt>
      <dd className="text-xl font-semibold mt-2">{value}</dd>
      {additional}
    </dl>
  )
}
