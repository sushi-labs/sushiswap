import { Layout } from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { BorrowSection } from '../../components'
import { getPairsForSymbol } from '../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pairs] = await Promise.all([
    getPairsForSymbol({
      symbol: (query.symbol as string).toLowerCase(),
      asset: false,
      orderBy: 'borrowAPR',
      orderDirection: 'desc',
    }),
  ])

  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: `/kashi/api/pairs?symbol=${(query.symbol as string).toLowerCase()}&asset=false`,
          args: {
            sorting: [
              {
                id: 'borrowAPR',
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
