import { Tab } from '@headlessui/react'
import React, { FC, Fragment, useState } from 'react'
import { useAccount } from 'wagmi'
import { useUserPositions } from '../../lib/hooks'

import { PoolsTable, PositionsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'
import { Button } from '@sushiswap/ui/future/components/button'

export const PoolsSection: FC<{ isReady?: boolean }> = ({ isReady }) => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)
  const { data: userPositions } = useUserPositions({ id: address as string }, !!address)

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
                  My Positions{' '}
                  <div className="bg-blue/10 rounded-full w-5 h-5 flex items-center justify-center text-blue font-semibold text-xs">
                    {userPositions?.length ?? ''}
                  </div>
                </Button>
              )}
            </Tab>
          )}
        </div>
        <TableFilters showAllFilters={tab === 0} />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PoolsTable isReady={isReady} />
          </Tab.Panel>
          <Tab.Panel unmount={!address}>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
