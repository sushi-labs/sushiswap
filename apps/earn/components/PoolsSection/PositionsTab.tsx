import { Tab } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { Button } from '@sushiswap/ui/future/components/button'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'
import { PositionsTable } from './Tables'
import Container from '@sushiswap/ui/future/components/Container'
import { TableFilters } from './Tables/TableFilters'

export const PositionsTab = () => {
  const [tabPositions, setTabPositions] = useState<number>(0)
  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <TableFilters showCategories={false} />
      <Tab.Group defaultIndex={0} selectedIndex={tabPositions} onChange={setTabPositions}>
        <div className="flex items-center gap-2 mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button
                size="sm"
                variant="outlined"
                color={selected ? 'blue' : 'default'}
                className="items-center !gap-2.5"
              >
                <span>🍣</span>{' '}
                <span>
                  SushiSwap <sup>v3</sup>
                </span>
              </Button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button
                size="sm"
                variant="outlined"
                color={selected ? 'blue' : 'default'}
                className="items-center !gap-2.5"
              >
                <span>🍣</span>{' '}
                <span>
                  SushiSwap <sup>v2</sup>
                </span>
              </Button>
            )}
          </Tab>
        </div>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <ConcentratedPositionsTable />
          </Tab.Panel>
          <Tab.Panel>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Container>
  )
}
