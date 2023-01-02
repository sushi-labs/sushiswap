import { ExternalLinkIcon } from '@heroicons/react/solid'
import { chainShortName } from '@sushiswap/chain'
import { formatPercent } from '@sushiswap/format'
import { getBuiltGraphSDK, Pair } from '@sushiswap/graph-client'
import { AppearOnMount, BreadcrumbLink, Container, Link, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR, { SWRConfig } from 'swr'

import {
  AddSectionMyPosition,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
  RemoveSectionLegacy,
  RemoveSectionTrident,
  RemoveSectionUnstake,
} from '../../components'
import { GET_POOL_TYPE_MAP } from '../../lib/constants'

const LINKS = ({ pair }: { pair: Pair }): BreadcrumbLink[] => [
  {
    href: `/${pair.id}`,
    label: `${pair.name} - ${GET_POOL_TYPE_MAP[pair.type as keyof typeof GET_POOL_TYPE_MAP]} - ${formatPercent(
      pair.swapFee / 10000
    )}`,
  },
  {
    href: `/${pair.id}/remove`,
    label: `Remove Liquidity`,
  },
]

const Remove: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Remove />
    </SWRConfig>
  )
}

const _Remove = () => {
  const router = useRouter()
  const { data } = useSWR<{ pair: Pair }>(`/earn/api/pool/${router.query.id}`, (url) =>
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
              <RemoveSectionUnstake poolAddress={pair.id} />
              {pair.source === 'TRIDENT' ? <RemoveSectionTrident pair={pair} /> : <RemoveSectionLegacy pair={pair} />}
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

export const getStaticPaths: GetStaticPaths = async () => {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const sdk = getBuiltGraphSDK()
  const { pairs } = await sdk.PairsByChainIds({
    first: 250,
    orderBy: 'liquidityUSD',
    orderDirection: 'desc',
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  // Get the paths we want to pre-render based on pairs
  const paths = pairs
    .sort(({ liquidityUSD: a }, { liquidityUSD: b }) => {
      return Number(b) - Number(a)
    })
    .slice(0, 250)
    .map((pair, i) => ({
      params: { id: `${chainShortName[pair.chainId]}:${pair.address}` },
    }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const sdk = getBuiltGraphSDK()
  const id = params?.id as string
  const { pair } = await sdk.PairById({ id })
  if (!pair) {
    throw new Error(`Failed to fetch pair, received ${pair}`)
  }
  return {
    props: {
      fallback: {
        [`/earn/api/pool/${id}`]: { pair },
      },
    },
    revalidate: 60,
  }
}

export default Remove
