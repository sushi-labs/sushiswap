import { PlusIcon } from '@heroicons/react/solid'
import { Button, Link, OnsenIcon, Typography } from '@sushiswap/ui'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Layout, PoolFilters, PoolsFiltersProvider, PoolsSection, SushiBarSection } from '../components'
import { getSushiBar } from '../lib/api'
import { getPoolCount, getPoolCountUrl, getPools, getPoolsUrl } from '@sushiswap/client'
import { defaultPoolsArgs } from '../lib/constants'
import { unstable_serialize } from 'swr/infinite'

export const getStaticProps: GetStaticProps = async () => {
  const [pools, poolCount, bar] = await Promise.all([
    getPools(defaultPoolsArgs),
    getPoolCount(defaultPoolsArgs),
    getSushiBar(),
  ])

  return {
    props: {
      fallback: {
        // Need unstable_serialize for SWRInfinite: https://github.com/vercel/swr/discussions/2164
        [unstable_serialize(() => getPoolsUrl(defaultPoolsArgs))]: pools,
        [getPoolCountUrl(defaultPoolsArgs)]: poolCount,
        [`/earn/api/bar`]: bar,
      },
      revalidate: 60,
    },
  }
}

const Pools: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools />
    </SWRConfig>
  )
}

export const _Pools: FC<{ filters?: Partial<PoolFilters> }> = ({ filters }) => {
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
              <Button as="a" href="/earn/add" fullWidth color="blue" startIcon={<PlusIcon width={16} height={16} />}>
                New Position
              </Button>
              <Link.External href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button fullWidth color="gray" startIcon={<OnsenIcon width={16} height={16} />}>
                  Join Onsen
                </Button>
              </Link.External>
            </div>
          </div>
        </section>
        <SushiBarSection />
        <PoolsFiltersProvider passedFilters={filters}>
          <PoolsSection />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
