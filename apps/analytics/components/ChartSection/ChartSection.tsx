import { ChainId } from '@sushiswap/chain'
import stringify from 'fast-json-stable-stringify'
import { FC, useMemo } from 'react'
import useSWR from 'swr'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { TVLChart } from './TVLChart2'
import { VolumeChart } from './VolumeChart2'
import { useFilters } from 'components/Filters'
import Container from '@sushiswap/ui/future/components/Container'

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
  const { data, isValidating, isLoading } = useSWR({ url: '/analytics/api/charts', args }, fetcher)

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-slate-800/20 rounded-xl">
          {isLoading ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex justify-between flex-grow w-full">
                <Skeleton.Text fontSize="text-sm" className="w-10" />
                <Skeleton.Text fontSize="text-sm" className="w-[130px]" align="right" />
              </div>
              <div className="flex flex-col">
                <Skeleton.Text fontSize="text-xl" className="w-[120px]" />
                <Skeleton.Text fontSize="text-sm" className="w-[160px]" />
              </div>
              <Skeleton.Box className="w-full h-[328px]" />
            </div>
          ) : (
            <TVLChart x={data?.[0]?.[0]} y={data?.[0]?.[1]} />
          )}
        </div>
        <div className="p-6 bg-slate-800/20 rounded-xl">
          {isLoading ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex justify-between flex-grow w-full">
                <Skeleton.Text fontSize="text-sm" className="w-10" />
                <Skeleton.Text fontSize="text-sm" className="w-[130px]" align="right" />
              </div>
              <div className="flex flex-col">
                <Skeleton.Text fontSize="text-xl" className="w-[120px]" />
                <Skeleton.Text fontSize="text-sm" className="w-[160px]" />
              </div>
              <Skeleton.Box className="w-full h-[328px]" />
            </div>
          ) : (
            <VolumeChart x={data?.[1]?.[0]} y={data?.[1]?.[1]} />
          )}
        </div>
      </section>
    </Container>
  )
}
