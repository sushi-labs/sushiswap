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
        selectedTable: val === 0 ? SelectedTable.Markets : SelectedTable.Tokens,
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
                Pools
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
            <PoolTable />
          </Tab.Panel>
          {/* <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel> */}
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
