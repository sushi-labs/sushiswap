'use client'

import stringify from 'fast-json-stable-stringify'
import { FC } from 'react'
import useSWR from 'swr'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { TVLChart } from './tvl-chart'
import { VolumeChart } from './volume-chart'

const fetcher = ({ url }: { url: string }) => {
  const _url = new URL(url, window.location.origin)
  _url.searchParams.set('networks', stringify(SUPPORTED_CHAIN_IDS))

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const GlobalStatsCharts: FC = () => {
  const { data } = useSWR({ url: '/analytics/api/charts' }, fetcher)
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
      <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
    </section>
  )
}
