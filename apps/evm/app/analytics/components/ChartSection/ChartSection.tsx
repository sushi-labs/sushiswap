'use client'

import { ChainId } from '@sushiswap/chain'
import { Container } from '@sushiswap/ui/components/container'
import stringify from 'fast-json-stable-stringify'
import { FC, useMemo } from 'react'
import useSWR from 'swr'

import { useFilters } from '../Filters'
import { TVLChart } from './TVLChart2'
import { VolumeChart } from './VolumeChart2'

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    chainIds: ChainId[]
  }
}) => {
  const _url = new URL(url, window.location.origin)
  if (args.chainIds) {
    _url.searchParams.set('networks', stringify(args.chainIds))
  }
  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const ChartSection: FC = () => {
  const { chainIds } = useFilters()

  const args = useMemo(() => ({ chainIds }), [chainIds])
  const { data, isLoading } = useSWR({ url: '/analytics/api/charts', args }, fetcher)

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
        <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
      </section>
    </Container>
  )
}
