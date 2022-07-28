import { useIsMounted } from '@sushiswap/hooks'
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
  const isMounted = useIsMounted()
  const {
    data: { pair },
  } = useSWR<{ pair: PairWithAlias }>(`/pool/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  return (
    <Layout>
      <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
        <div className="flex flex-col gap-9 order-1">
          <PoolHeader pair={pair} />
          <hr className="border-t border-slate-200/5 my-3" />
          <PoolChart pair={pair} />
          <PoolStats pair={pair} />
          <PoolComposition pair={pair} />
          <PoolRewards pair={pair} />
        </div>
        <div className="flex flex-col gap-4 order-2">
          <PoolPosition pair={pair} />
          <PoolButtons pair={pair} />
        </div>
      </div>
    </Layout>
  )
}

export default Pool
