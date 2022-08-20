import { ENABLED_NETWORKS } from 'config'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { Layout, PairsProvider, PairTable, PairTableSection } from '../components'
import { ChartSection } from '../components/ChartSection'
import { getCharts, getPairs } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pairs, charts] = await Promise.all([getPairs(), getCharts()])
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
