import { SUPPORTED_CHAIN_IDS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { ChartSection, Layout, PoolsFiltersProvider, TableSection } from '../components'
import {
  getBundles,
  getCharts,
  getPoolCount,
  getPools,
  GetPoolsQuery,
  getTokenCount,
  getTokens,
  GetTokensQuery,
} from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const [pairs, tokens, charts, poolCount, tokenCount, bundles] = await Promise.all([
    getPools(query as unknown as GetPoolsQuery),
    getTokens(query as unknown as GetTokensQuery),
    getCharts(),
    getPoolCount(),
    getTokenCount(),
    getBundles(),
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
        [unstable_serialize({
          url: '/analytics/api/tokens',
          args: {
            sorting: [
              {
                id: 'liquidityNative',
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
        })]: tokens,
        [`/analytics/api/charts`]: charts,
        [`/analytics/api/pools/count`]: poolCount,
        [`/analytics/api/tokens/count`]: tokenCount,
        [`/analytics/api/bundles`]: bundles,
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
