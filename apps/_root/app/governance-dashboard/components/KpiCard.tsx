import React, { ReactNode } from 'react'

interface Kpi {
  title: string
  value: ReactNode
  additional: ReactNode
  index?: number
}

export function KpiCard(props: Kpi) {
  const { title, value, additional, index } = props
  return (
    <dl className="rounded-lg bg-[#1A2031] p-5" key={index}>
      <dt className="text-sm text-slate-400">{title}</dt>
      <dd className="mt-2 text-xl font-semibold">{value}</dd>
      {additional}
    </dl>
  )
}
