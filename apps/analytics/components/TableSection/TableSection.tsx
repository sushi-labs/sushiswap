import { Tab } from '@headlessui/react'
import React, { FC, Fragment, useCallback } from 'react'

import { PoolTable } from '../PoolTable'
import { SelectedTable, usePoolFilters } from '../PoolsFiltersProvider'
import { TableFilters } from '../Table/TableFilters'
import { TokenTable } from '../TokenTable'
import { Button } from '@sushiswap/ui/future/components/button'

export const TableSection: FC = () => {
  const { setFilters, selectedTable } = usePoolFilters()

  const onChange = useCallback(
    (val: number) => {
      setFilters({
        selectedTable: val === 0 ? SelectedTable.VerifiedPools : SelectedTable.UnverifiedPools,
      })
    },
    [setFilters]
  )

  return (
    <section className="flex flex-col">
      <Tab.Group onChange={onChange}>
        <div className="flex items-center gap-2 mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Verified Pools
              </Button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Unverified Pools
              </Button>
            )}
          </Tab>
          {/* <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Tokens
              </Button>
            )}
          </Tab> */}
        </div>
        <TableFilters />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PoolTable isWhitelisted={true} />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <PoolTable isWhitelisted={false} />
          </Tab.Panel>
          {/* <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel> */}
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
