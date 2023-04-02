import { Tab } from '@headlessui/react'
import React, { FC, Fragment, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { PoolsTable, PositionsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'
import { Button } from '@sushiswap/ui/future/components/button'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'

export const PoolsSection: FC<{ isReady?: boolean }> = ({ isReady }) => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)

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

          {address && (
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
            <PoolsTable isReady={isReady} />
          </Tab.Panel>
          <Tab.Panel unmount={!address}>
            <div className="border-t border-slate-200/5">
              <ConcentratedPositionsTable />
              <div className="h-px bg-slate-200/5 w-full" />
              <PositionsTable />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
