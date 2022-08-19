import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  Layout,
  PoolButtons,
  PoolChart,
  PoolComposition,
  PoolHeader,
  PoolPosition,
  PoolRewards,
  PoolStats,
} from '../../components'
import { getPool, getSushiBar } from '../../lib/api'
import { PairWithAlias } from '../../types'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pair, stats] = await Promise.all([getPool(query.id as string), getSushiBar()])

  return {
    props: {
      fallback: {
        [`/pool/api/pool/${query.id}`]: { pair },
        [`/pool/api/bar`]: { stats },
      },
    },
  }
}

const Pool: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool />
    </SWRConfig>
  )
}

const _Pool = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data

  return (
    <Layout>
      <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
        <div className="flex flex-col order-1 gap-9">
          <PoolHeader pair={pair} />
          <hr className="my-3 border-t border-slate-200/5" />
          <PoolChart pair={pair} />
          <PoolStats pair={pair} />
          <PoolComposition pair={pair} />
          <PoolRewards pair={pair} />
        </div>
        <div className="flex flex-col order-2 gap-4">
          <PoolPosition pair={pair} />
          <div className="hidden lg:flex">
            <PoolButtons pair={pair} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Pool
