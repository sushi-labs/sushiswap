import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  Layout,
  PoolActionBar,
  PoolButtons,
  PoolChart,
  PoolComposition,
  PoolHeader,
  PoolMyRewards,
  PoolPosition,
  PoolPositionProvider,
  PoolPositionRewardsProvider,
  PoolPositionStakedProvider,
  PoolRewards,
  PoolStats,
} from '../../components'
import { getPool } from '../../lib/api'
import { GET_POOL_TYPE_MAP } from '../../lib/constants'
import { PairWithAlias } from '../../types'

const LINKS = ({ pair }: { pair: PairWithAlias }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${GET_POOL_TYPE_MAP[pair.type]} - ${formatPercent(pair.swapFee / 10000)}`,
  },
]

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=100, stale-while-revalidate=599')
  const id = query.id as string
  const pair = await getPool(id)
  return {
    props: {
      fallback: {
        [`/earn/api/pool/${id}`]: { pair },
      },
      id,
    },
  }
}

const Pool: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback, id }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pool id={id} />
    </SWRConfig>
  )
}

const fetcher = (url) => fetch(url).then((response) => response.json())

const _Pool = ({ id }: { id: string }) => {
  const { data } = useSWR<{ pair: PairWithAlias }>(id ? `/earn/api/pool/${id}` : null, fetcher)

  if (!data) return <></>

  const { pair } = data

  return (
    <PoolPositionProvider pair={pair}>
      <PoolPositionStakedProvider pair={pair}>
        <PoolPositionRewardsProvider pair={pair}>
          <Layout breadcrumbs={LINKS(data)}>
            <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
              <div className="flex flex-col order-1 gap-9">
                <PoolHeader pair={pair} />
                <hr className="my-3 border-t border-slate-200/5" />
                <PoolChart pair={pair} />
                <AppearOnMount>
                  <PoolStats pair={pair} />
                </AppearOnMount>
                <PoolComposition pair={pair} />
                <PoolRewards pair={pair} />
              </div>

              <div className="flex flex-col order-2 gap-4">
                <AppearOnMount>
                  <div className="flex flex-col gap-10">
                    <PoolMyRewards pair={pair} />
                    <PoolPosition pair={pair} />
                  </div>
                </AppearOnMount>
                <div className="hidden lg:flex">
                  <PoolButtons pair={pair} />
                </div>
              </div>
            </div>
          </Layout>
          <PoolActionBar pair={pair} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export default Pool
