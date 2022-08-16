import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Layout, PairsProvider, PairTable, PairTableSection } from '../components'
import { ChartSection } from '../components/ChartSection'
import { getPairs, getStats } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pairs, stats] = await Promise.all([getPairs(), getStats()])

  return {
    props: {
      fallback: {
        [`/analytics/api/pairs`]: pairs,
        [`/analytics/api/stats`]: stats,
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
