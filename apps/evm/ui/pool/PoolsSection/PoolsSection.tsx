import { Tab } from '@headlessui/react'
import { useIsMounted } from '@sushiswap/hooks'
import { Container } from '@sushiswap/ui/components/container'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { useAccount } from '@sushiswap/wagmi'
import React, { FC, Fragment, useState } from 'react'

import { MigrateTab } from './MigrateTab'
import { PositionsTab } from './PositionsTab'
import { RewardsTab } from './RewardsTab'
import { PoolsTable } from './Tables'
import { TableFiltersResetButton, TableFiltersSearchToken } from './Tables/TableFilters'
import { TableFiltersNetwork } from './Tables/TableFilters/TableFiltersNetwork'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)
  const isMounted = useIsMounted()

  return (
    <section className="flex flex-col flex-1">
      <Tab.Group defaultIndex={0} selectedIndex={tab} onChange={setTab}>
        <Container maxWidth="full" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  All Pools
                </Toggle>
              )}
            </Tab>
            {address && isMounted && (
              <>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Toggle size="sm" pressed={selected} testId="my-positions">
                      My Positions
                    </Toggle>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Toggle size="sm" pressed={selected} testId="my-rewards">
                      My Rewards
                    </Toggle>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Toggle size="sm" pressed={selected} testId="migrate">
                      Migrate
                    </Toggle>
                  )}
                </Tab>
              </>
            )}
          </div>
        </Container>
        <Tab.Panels className="bg-gray-50 dark:bg-white/[0.02] pb-20 h-full">
          <Tab.Panel unmount={false}>
            <Container maxWidth="full" className="px-4 flex flex-col mx-auto h-full">
              <PoolsTable />
            </Container>
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <Container maxWidth="full" className="px-4 mx-auto h-full">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <TableFiltersSearchToken />
                <TableFiltersNetwork />
                <TableFiltersResetButton />
              </div>
            </Container>
            <PositionsTab />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <RewardsTab />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <MigrateTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
