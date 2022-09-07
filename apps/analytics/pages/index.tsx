import { SUPPORTED_CHAIN_IDS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { Layout, PoolsFiltersProvider } from '../components'
import { ChartSection } from '../components/ChartSection'
import { TableSection } from '../components/TableSection'
import { getCharts, getPoolCount, getPools, GetPoolsQuery } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const [pairs, charts, poolCount] = await Promise.all([
    getPools(query as unknown as GetPoolsQuery),
    getCharts(),
    getPoolCount(),
  ])

  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/analytics/api/pools',
          args: {
            sorting: [
              {
                id: 'apr',
                desc: true,
              },
            ],
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
            query: '',
            extraQuery: '',
          },
        })]: pairs,
        [`/analytics/api/charts`]: charts,
        [`/analytics/api/pools/count`]: poolCount,
      },
    },
  }
}

const Index: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Index />
    </SWRConfig>
  )
}

const _Index = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <PoolsFiltersProvider>
          <ChartSection />
          <TableSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Index
