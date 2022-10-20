import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { LendSection } from '../../../components'
import { getPairsForSymbol } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const symbol = query.symbol as string

  const pairs = await getPairsForSymbol({
    where: {
      asset_: { symbol_contains_nocase: symbol.toLowerCase() },
      totalBorrow_: { base_not: '0' },
    },
    orderBy: 'supplyAPR',
    orderDirection: 'desc',
  })

  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: `/kashi/api/lend/${symbol.toLowerCase()}`,
          args: {
            sorting: [
              {
                id: 'supplyAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
          },
        })]: pairs,
      },
    },
  }
}

const Lend: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Lend />
    </SWRConfig>
  )
}

const _Lend = () => {
  return (
    <Layout>
      <LendSection />
    </Layout>
  )
}

export default Lend
