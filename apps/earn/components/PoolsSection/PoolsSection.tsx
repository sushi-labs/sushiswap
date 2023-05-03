import { Tab } from '@headlessui/react'
import React, { FC, Fragment, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { PoolsTable, PositionsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'
import { Button } from '@sushiswap/ui/future/components/button'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'
import { useIsMounted } from '@sushiswap/hooks'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)
  const isMounted = useIsMounted()

  return (
    <section className="flex flex-col">
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <div className="flex items-center gap-2 mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Pools
              </Button>
            )}
          </Tab>

          {address && isMounted && (
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                  My Positions
                </Button>
              )}
            </Tab>
          )}
        </div>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <TableFilters showAllFilters={tab === 0} />
            <div className="border-t border-gray-900/5 dark:border-slate-200/5" />
            <PoolsTable />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <div className="border-t border-gray-900/5 dark:border-slate-200/5">
              <ConcentratedPositionsTable />
              <div className="h-px bg-gray-900/5 dark:bg-slate-200/5 w-full" />
              <PositionsTable />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
