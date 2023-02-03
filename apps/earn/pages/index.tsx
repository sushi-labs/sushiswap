import { PlusIcon } from '@heroicons/react/solid'
import { Button, Link, OnsenIcon, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from '../config'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { FC, useMemo } from 'react'
import { SWRConfig, unstable_serialize } from 'swr'

import { Layout, PoolsFiltersProvider, PoolsSection, SushiBarSection } from '../components'
import { getBundles, getPoolCount, getPools, getSushiBar } from '../lib/api'
import { AVAILABLE_POOL_TYPE_MAP } from '../lib/constants'

export const getStaticProps: GetStaticProps = async (context) => {
  const [pairs, bundles, poolCount, bar] = await Promise.all([getPools(), getBundles(), getPoolCount(), getSushiBar()])
  return {
    props: {
      selectedNetworks: SUPPORTED_CHAIN_IDS,
      fallback: {
        [unstable_serialize({
          url: '/earn/api/pools',
          args: {
            sorting: [
              {
                id: 'liquidityUSD',
                desc: true,
              },
            ],
            selectedNetworks: SUPPORTED_CHAIN_IDS,
            selectedPoolTypes: Object.keys(AVAILABLE_POOL_TYPE_MAP),
            farmsOnly: false,
            pagination: {
              pageIndex: 0,
              pageSize: 20,
            },
            query: '',
            extraQuery: '',
          },
        })]: pairs,
        [`/earn/api/bundles`]: bundles,
        [`/earn/api/pools/count`]: poolCount,
        [`/earn/api/bar`]: bar,
      },
      revalidate: 60,
    },
  }
}

const Pools: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback, selectedNetworks }) => {
  const parsedSelectedNetworks = useMemo(
    () => selectedNetworks.map(Number) as typeof SUPPORTED_CHAIN_IDS,
    [selectedNetworks]
  )
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools selectedNetworks={parsedSelectedNetworks} />
    </SWRConfig>
  )
}

const _Pools = ({ selectedNetworks }: { selectedNetworks: typeof SUPPORTED_CHAIN_IDS }) => {
  return (
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="max-w-md space-y-4">
            <Typography variant="hero" weight={600} className="text-slate-50">
              Earn
            </Typography>
            <p className="text-slate-300">Earn fees by providing liquidity.</p>
          </div>
          <div className="flex justify-end flex-grow not-prose">
            <div className="flex flex-col gap-3 w-full lg:w-[200px]">
              {/* <Link.Internal href="/add" passHref={true}> */}
              <Button as="a" href="/earn/add" fullWidth color="blue" startIcon={<PlusIcon width={16} height={16} />}>
                New Position
              </Button>
              {/* </Link.Internal> */}
              <Link.External href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button fullWidth color="gray" startIcon={<OnsenIcon width={16} height={16} />}>
                  Join Onsen
                </Button>
              </Link.External>
            </div>
          </div>
        </section>
        {/* <SushiBarSection /> */}
        <PoolsFiltersProvider selectedNetworks={selectedNetworks}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
