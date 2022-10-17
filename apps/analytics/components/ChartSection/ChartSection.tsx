import { ChainId } from '@sushiswap/chain'
import { usePoolFilters } from 'components/PoolsFiltersProvider'
import { FC, useMemo } from 'react'
import useSWR from 'swr'

import { TVLChart } from './TVLChart2'
import { VolumeChart } from './VolumeChart2'

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    selectedNetworks: ChainId[]
  }
}) => {
  const _url = new URL(url, window.location.origin)
  if (args.selectedNetworks) {
    _url.searchParams.set('networks', JSON.stringify(args.selectedNetworks))
  }
  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))
}

export const ChartSection: FC = () => {
  const { selectedNetworks } = usePoolFilters()
  const args = useMemo(() => ({ selectedNetworks }), [selectedNetworks])
  const { data, isValidating } = useSWR({ url: '/analytics/api/charts', args }, fetcher)
  // const { data } = useSWR('/analytics/api/charts', fetcher)
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
