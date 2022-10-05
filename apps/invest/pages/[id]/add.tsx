import { ExternalLinkIcon } from '@heroicons/react/solid'
import { formatPercent } from '@sushiswap/format'
import { AppearOnMount, BreadcrumbLink, Container, Link, Typography } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  AddSectionLegacy,
  AddSectionMyPosition,
  AddSectionStake,
  AddSectionTrident,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
} from '../../components'
import { getPool } from '../../lib/api'
import { GET_POOL_TYPE_MAP } from '../../lib/constants'
import { PairWithAlias } from '../../types'

const LINKS = ({ pair }: { pair: PairWithAlias }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${GET_POOL_TYPE_MAP[pair.type]} - ${formatPercent(pair.swapFee / 10000)}`,
  },
  {
    href: `/${pair.id}/add`,
    label: `Add Liquidity`,
  },
]

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pair] = await Promise.all([getPool(query.id as string)])
  return {
    props: {
      fallback: {
        [`/earn/api/pool/${query.id}`]: { pair },
      },
    },
  }
}

const Add: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Add />
    </SWRConfig>
  )
}

const _Add = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: PairWithAlias }>(`/earn/api/pool/${router.query.id}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  if (!data) return <></>
  const { pair } = data

  return (
    <PoolPositionProvider pair={pair}>
      <PoolPositionStakedProvider pair={pair}>
        <Layout breadcrumbs={LINKS(data)}>
          <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
            <div className="hidden md:block" />
            <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
              {pair.source === 'TRIDENT' ? <AddSectionTrident pair={pair} /> : <AddSectionLegacy pair={pair} />}
              <AddSectionStake poolAddress={pair.id} />
              <Container className="flex justify-center">
                <Link.External
                  href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                  className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
                >
                  <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-500">
                    Learn more about liquidity and yield farming
                    <ExternalLinkIcon width={16} height={16} className="text-slate-500" />
                  </Typography>
                </Link.External>
              </Container>
            </div>
            <div className="order-1 sm:order-3">
              <AppearOnMount>
                <AddSectionMyPosition pair={pair} />
              </AppearOnMount>
            </div>
          </div>
          <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
        </Layout>
      </PoolPositionStakedProvider>
    </PoolPositionProvider>
  )
}

export default Add
