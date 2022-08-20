import { FC } from 'react'
import useSWR from 'swr'

import { TVLChart } from './TVLChart2'
import { VolumeChart } from './VolumeChart2'
// import { TVLChart } from './TVLChart'
// import { VolumeChart } from './VolumeChart'

export const ChartSection: FC = () => {
  // const { data: stats } = useSWR<Pair[]>('/analytics/api/stats', (url) =>
  //   fetch(url).then((response) => response.json())
  // )
  const { data } = useSWR<[[number[], number[]], [number[], number[]]]>('/analytics/api/charts', (url) =>
    fetch(url).then((response) => response.json())
  )
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
      </div>
      <div className="p-6 bg-slate-800/20 rounded-xl">
        <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
      </div>
    </section>
  )
}
