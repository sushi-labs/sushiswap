import { FC } from 'react'
import useSWR from 'swr'

import { Pair } from '../../.graphclient'
import { TVLChart } from './TVLChart'
import { VolumeChart } from './VolumeChart'

export const ChartSection: FC = () => {
  const { data: stats } = useSWR<Pair[]>('/analytics/api/stats', (url) =>
    fetch(url).then((response) => response.json())
  )
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <TVLChart stats={stats} />
      </div>
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <VolumeChart stats={stats} />
      </div>
    </section>
  )
}
