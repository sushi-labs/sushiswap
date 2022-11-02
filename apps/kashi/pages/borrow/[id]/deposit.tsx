import { BorrowHeader, BorrowWidget, Layout, MarketInformation, YourPosition } from 'components'
import { useMarket } from 'lib/hooks/useMarket'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { BorrowProvider } from '../../../components/BorrowProvider'
import { getPair } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const pair = await getPair(query.id as string)
  return {
    props: {
      fallback: {
        [`/kashi/api/pair/${query.id}`]: pair,
      },
    },
  }
}

const BorrowDeposit: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_BorrowDeposit />
    </SWRConfig>
  )
}

const _BorrowDeposit = () => {
  const pair = useMarket()
  if (!pair) return <></>
  return (
    <Layout>
      <BorrowProvider pair={pair}>
        <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
          <div className="flex flex-col order-1 gap-9">
            <div className="mb-4">
              <BorrowHeader pair={pair} />
            </div>
            <YourPosition pair={pair} />
            <MarketInformation pair={pair} />
          </div>
          <div className="flex flex-col order-2 gap-4">
            <BorrowWidget pair={pair} />
          </div>
        </div>
      </BorrowProvider>
    </Layout>
  )
}

export default BorrowDeposit
