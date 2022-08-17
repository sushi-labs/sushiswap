import {
  Layout,
  MarketButtons,
  MarketChart,
  MarketHeader,
  MarketPosition,
  MarketRewards,
  MarketStats,
} from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { KashiPair } from '../../../.graphclient'
import { getPair } from '../../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pair] = await Promise.all([getPair(query.id as string)])

  return {
    props: {
      fallback: {
        [`/kashi/api/pair/${query.id}`]: { pair },
      },
    },
  }
}

const BorrowMarket: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_BorrowMarket />
    </SWRConfig>
  )
}

const _BorrowMarket = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: KashiPair }>(`/kashi/api/pair/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data

  return (
    <Layout>
      <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
        <div className="flex flex-col order-1 gap-9">
          <MarketHeader side="borrow" pair={pair} />
          <hr className="my-3 border-t border-slate-200/5" />
          <MarketChart pair={pair} />
          <MarketStats pair={pair} />
          <MarketRewards pair={pair} />
        </div>
        <div className="flex flex-col order-2 gap-4">
          <MarketPosition side="borrow" pair={pair} />
          <div className="hidden lg:flex">
            <MarketButtons side="borrow" pair={pair} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BorrowMarket
