'use client'

import { ChainId } from '@sushiswap/chain'
import { Container } from '@sushiswap/ui/components/container'
import { SkeletonBox, SkeletonText } from '@sushiswap/ui/components/skeleton'
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
        <div className="p-6 bg-slate-800/20 rounded-xl">
          {isLoading ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex justify-between flex-grow w-full">
                <SkeletonText fontSize="sm" className="w-10" />
                <SkeletonText fontSize="sm" className="w-[130px]" align="right" />
              </div>
              <div className="flex flex-col">
                <SkeletonText fontSize="xl" className="w-[120px]" />
                <SkeletonText fontSize="sm" className="w-[160px]" />
              </div>
              <SkeletonBox className="w-full h-[328px]" />
            </div>
          ) : (
            <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
          )}
        </div>
        <div className="p-6 bg-slate-800/20 rounded-xl">
          {isLoading ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex justify-between flex-grow w-full">
                <SkeletonText fontSize="sm" className="w-10" />
                <SkeletonText fontSize="sm" className="w-[130px]" align="right" />
              </div>
              <div className="flex flex-col">
                <SkeletonText fontSize="xl" className="w-[120px]" />
                <SkeletonText fontSize="sm" className="w-[160px]" />
              </div>
              <SkeletonBox className="w-full h-[328px]" />
            </div>
          ) : (
            <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
          )}
        </div>
      </section>
    </Container>
  )
}
