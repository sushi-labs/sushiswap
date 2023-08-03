import { Tab } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import { Container } from '@sushiswap/ui/components/container'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { useAccount } from '@sushiswap/wagmi'
import React, { FC, Fragment, useState } from 'react'

import { PositionsTab } from './PositionsTab'
import { RewardsTab } from './RewardsTab'
import { PoolsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)
  const isMounted = useIsMounted()
  // const { push } = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()

  return (
    <section className="flex flex-col">
      <Tab.Group defaultIndex={0} selectedIndex={tab} onChange={setTab}>
        <Container maxWidth="7xl" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  All
                </Toggle>
              )}
            </Tab>
            {address && isMounted && (
              <>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Toggle
                      size="sm"
                      pressed={selected}
                      testId="my-positions"
                      // onClick={() => {
                      //   const _searchParams = new URLSearchParams(searchParams)
                      //   _searchParams.set('tab', 'my-positions')
                      //   void push(`${pathname}?${_searchParams.toString()}`)
                      // }}
                    >
                      My Positions
                    </Toggle>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Toggle
                      size="sm"
                      pressed={selected}
                      testId="my-rewards"
                      // onClick={() => {
                      //   const _searchParams = new URLSearchParams(searchParams)
                      //   _searchParams.set('tab', 'my-rewards')
                      //   void push(`${pathname}?${_searchParams.toString()}`)
                      // }}
                    >
                      My Rewards
                    </Toggle>
                  )}
                </Tab>
              </>
            )}
          </div>
        </Container>
        <Tab.Panels className="bg-gray-50 dark:bg-white/[0.02] pt-4">
          <Container maxWidth="7xl" className="px-4 mx-auto">
            <TableFilters showCategories={tab === 0} />
          </Container>
          <Tab.Panel unmount={false}>
            <Container maxWidth="7xl" className="px-4 mx-auto">
              <PoolsTable />
            </Container>
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <PositionsTab />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <RewardsTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
