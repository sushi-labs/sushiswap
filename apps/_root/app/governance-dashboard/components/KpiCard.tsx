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
    <dl className="bg-[#1A2031] rounded-lg p-5" key={index}>
      <dt className="text-slate-400 text-sm">{title}</dt>
      <dd className="text-xl font-semibold mt-2">{value}</dd>
      {additional}
    </dl>
  )
}
