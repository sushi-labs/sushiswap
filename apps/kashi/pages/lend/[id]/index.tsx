import { Layout, LendButtons, LendHeader, MarketChart, MarketPosition, MarketRewards, MarketStats } from 'components'
import { useMarket } from 'lib/hooks/useMarket'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { getPair } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const id = query.id as string
  // console.log('getPair', id)
  const pair = await getPair(id)
  return {
    props: {
      fallback: {
        [`/kashi/api/pair/${id}`]: pair,
      },
    },
  }
}

const LendMarket: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_LendMarket />
    </SWRConfig>
  )
}

const _LendMarket = () => {
  const pair = useMarket()
  if (!pair) return <></>
  return (
    <Layout>
      <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
        <div className="flex flex-col order-1 gap-9">
          <LendHeader pair={pair} />
          <hr className="my-3 border-t border-slate-200/5" />
          <MarketChart pair={pair} />
          <MarketStats pair={pair} />
          <MarketRewards pair={pair} />
        </div>
        <div className="flex flex-col order-2 gap-4">
          <MarketPosition side="lend" pair={pair} />
          <div className="hidden lg:flex">
            <LendButtons pair={pair} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LendMarket
