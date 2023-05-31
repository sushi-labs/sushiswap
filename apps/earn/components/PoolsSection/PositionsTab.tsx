import { Tab } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { Button } from '@sushiswap/ui/future/components/button'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'
import { PositionsTable } from './Tables'
import Container from '@sushiswap/ui/future/components/Container'
import Switch from '@sushiswap/ui/future/components/Switch'

export const PositionsTab = () => {
  const [hide, setHide] = useState(true)
  const [tabPositions, setTabPositions] = useState<number>(0)

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <Tab.Group defaultIndex={0} selectedIndex={tabPositions} onChange={setTabPositions}>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3 mb-4">
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
          <div className="flex gap-1 items-center px-2.5">
            <span className="font-medium text-sm text-gray-600 dark:text-slate-400">Include closed</span>
            <Switch size="sm" checked={hide} onChange={() => setHide((prev) => !prev)} className="scale-75" />
          </div>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <ConcentratedPositionsTable hideClosed={hide} />
          </Tab.Panel>
          <Tab.Panel>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Container>
  )
}
