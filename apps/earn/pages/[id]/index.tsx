import { Tab } from '@headlessui/react'
import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink, classNames } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
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
  SwapsTable,
  AddLiquidityTable,
  RemoveLiquidityTable,
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

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const pair = await getPool(query.id as string)
  return {
    props: {
      fallback: {
        [`/earn/api/pool/${query.id}`]: { pair },
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
  const { data } = useSWR<{ pair: PairWithAlias }>(`/earn/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  const [tab, setTab] = useState<number>(0)

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
            <section className="flex flex-col mt-10">
              <Tab.Group selectedIndex={tab} onChange={setTab}>
                <div className="flex items-center gap-6 mb-4 px-2">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected ? 'text-slate-200' : 'text-slate-500',
                        'hover:text-slate-50 focus:text-slate-50 font-semibold !outline-none'
                      )
                    }
                  >
                    Swaps
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected ? 'text-slate-200' : 'text-slate-500',
                        'hover:text-slate-50 focus:text-slate-50 font-semibold !outline-none'
                      )
                    }
                  >
                    Add Liquidity
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        selected ? 'text-slate-200' : 'text-slate-500',
                        'hover:text-slate-50 focus:text-slate-50 font-semibold !outline-none'
                      )
                    }
                  >
                    Remove Liquidity
                  </Tab>
                </div> 
                <Tab.Panels>
                  <Tab.Panel unmount={false}>
                    <SwapsTable pair={pair}/>
                  </Tab.Panel>
                  <Tab.Panel unmount={false}>
                    <AddLiquidityTable pair={pair}/>
                  </Tab.Panel>
                  <Tab.Panel unmount={false}>
                    <RemoveLiquidityTable pair={pair}/>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </section>
          </Layout>
          <PoolActionBar pair={pair} />
        </PoolPositionRewardsProvider>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export default Pool
