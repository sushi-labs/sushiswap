import { PlusIcon } from '@heroicons/react/solid'
import { AppearOnMount, Link, OnsenIcon } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { FC } from 'react'
import { useNetwork } from '@sushiswap/wagmi'
import { Layout, PoolFilters, PoolsFiltersProvider, PoolsSection } from '../components'

export const Pools: FC<{ filters?: Partial<PoolFilters>; isReady?: boolean }> = ({ filters, isReady }) => {
  const { chain } = useNetwork()
  return (
    <Layout maxWidth="7xl">
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-col max-w-md gap-2">
            <h1 className="font-semibold text-gray-900 text-7xl dark:text-slate-50">Pools.</h1>
            <span className="text-2xl text-gray-600 dark:text-slate-300">Provide liquidity and earn fees.</span>
          </div>
          <div className="flex justify-end flex-grow not-prose">
            <div className="flex flex-col gap-3 w-full lg:w-[200px]">
              <AppearOnMount>
                <Link.Internal href={`/add?chainId=${chain?.id}`}>
                  <Button
                    as="a"
                    href={`/add?chainId=${chain?.id}`}
                    fullWidth
                    color="blue"
                    startIcon={<PlusIcon width={16} height={16} />}
                    size="lg"
                  >
                    New Position
                  </Button>
                </Link.Internal>
              </AppearOnMount>

              <Link.External href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button fullWidth color="default" size="lg" startIcon={<OnsenIcon width={16} height={16} />}>
                  Join Onsen
                </Button>
              </Link.External>
            </div>
          </div>
        </section>
        <PoolsFiltersProvider passedFilters={filters}>
          <PoolsSection isReady={isReady} />
        </PoolsFiltersProvider>
      </div>
    </Layout>
  )
}

export default Pools
