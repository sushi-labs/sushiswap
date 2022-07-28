import { PlusIcon } from '@heroicons/react/solid'
import { Button, OnsenIcon } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import { Layout, PoolsProvider, PoolsSection, SushiBarSection } from '../components'
import { getBundles, getPools } from '../lib/api'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const [pairs, bundles] = await Promise.all([getPools(query), getBundles()])

  return {
    props: {
      fallback: {
        [`/pool/api/pools`]: pairs,
        [`/pool/api/bundles`]: bundles,
      },
    },
  }
}

const Pools: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Pools />
    </SWRConfig>
  )
}

const _Pools = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-16">
        <section className="flex flex-col lg:flex-row gap-6">
          <div className="space-y-4 max-w-md">
            <h2 className="font-bold text-2xl text-slate-50">Sushi Yield</h2>
            <p className="text-slate-300">
              Onsen is back with a new contract, allowing for more yield opportunities and functionalities.{' '}
            </p>
          </div>
          <div className="not-prose flex flex-grow justify-end">
            <div className="flex flex-col gap-3 w-full lg:w-[200px]">
              <Button fullWidth color="blue" startIcon={<PlusIcon width={20} height={20} />}>
                New Pool
              </Button>
              <Button fullWidth color="gray" startIcon={<OnsenIcon width={16} height={16} />}>
                Join Onsen
              </Button>
            </div>
          </div>
        </section>
        <SushiBarSection />
        <PoolsProvider>
          <PoolsSection />
        </PoolsProvider>
      </div>
    </Layout>
  )
}

export default Pools
