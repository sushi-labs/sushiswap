import { PlusIcon } from '@heroicons/react/solid'
import { Button, Link, OnsenIcon, Typography } from '@sushiswap/ui'
import { FC } from 'react'
import { useNetwork } from 'wagmi'
import { Layout, PoolFilters, PoolsFiltersProvider, PoolsSection } from '../components'

export const Pools: FC<{ filters?: Partial<PoolFilters>; isReady?: boolean }> = ({ filters, isReady }) => {
  const { chain } = useNetwork()
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
              <Link.Internal href={`/add${chain?.id ? `/${chain.id}` : ''}`}>
                <Button
                  as="a"
                  href={`/add${chain?.id ? `/${chain.id}` : ''}`}
                  fullWidth
                  color="blue"
                  startIcon={<PlusIcon width={16} height={16} />}
                >
                  New Position
                </Button>
              </Link.Internal>

              <Link.External href="https://rbieu62gj0f.typeform.com/to/KkrPkOFe">
                <Button fullWidth color="gray" startIcon={<OnsenIcon width={16} height={16} />}>
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
