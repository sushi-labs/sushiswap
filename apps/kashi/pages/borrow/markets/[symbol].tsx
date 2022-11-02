import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { BorrowSection } from '../../../components'
import { getPairs } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const symbol = query.symbol as string
  const pairs = await getPairs({
    where: {
      asset_: {
        symbol_contains_nocase: symbol.toLowerCase(),
      },
      // totalAsset_: { base_not: '0' },
    },
    orderBy: 'totalBorrowUSD',
    orderDirection: 'desc',
  })
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: `/kashi/api/borrow/${symbol.toLowerCase()}`,
          args: {
            sorting: [
              {
                id: 'totalBorrowUSD',
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

const Borrow: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Borrow />
    </SWRConfig>
  )
}

const _Borrow = () => {
  return (
    <Layout>
      <BorrowSection />
    </Layout>
  )
}

export default Borrow
