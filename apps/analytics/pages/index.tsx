import { ENABLED_NETWORKS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { Layout, PairsProvider, PairTable, PairTableSection } from '../components'
import { ChartSection } from '../components/ChartSection'
import { getCharts, getPairs, GetPairsQuery } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  // console.log('SSR query', query)
  const [pairs, charts] = await Promise.all([getPairs(query as unknown as GetPairsQuery), getCharts()])
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/analytics/api/pairs',
          args: {
            sorting: [
              {
                id: 'liquidityUSD',
                desc: true,
              },
            ],
            selectedNetworks: ENABLED_NETWORKS,
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
            query: '',
            extraQuery: '',
          },
        })]: pairs,
        [`/analytics/api/charts`]: charts,
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
      <div className="flex flex-col gap-4">
        <PairsProvider>
          <ChartSection />
          <PairTableSection>
            <PairTable />
          </PairTableSection>
        </PairsProvider>
      </div>
    </Layout>
  )
}

export default Index
