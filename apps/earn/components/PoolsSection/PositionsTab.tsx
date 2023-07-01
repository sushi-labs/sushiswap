import { Tab } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import { ConcentratedPositionsTable } from './Tables/PositionsTable/ConcentratedPositionsTable'
import { PositionsTable } from './Tables'
import { Container } from '@sushiswap/ui/components/container'
import { Switch } from '@sushiswap/ui/components/switch'
import { Toggle } from '@sushiswap/ui/components/toggle'

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
                <Toggle size="sm" pressed={selected}>
                  <span>🍣</span>{' '}
                  <span>
                    SushiSwap <sup>v3</sup>
                  </span>
                </Toggle>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  <span>🍣</span>{' '}
                  <span>
                    SushiSwap <sup>v2</sup>
                  </span>
                </Toggle>
              )}
            </Tab>
          </div>
          <div className="flex gap-3 items-center px-2.5">
            <span className="font-medium text-sm text-gray-600 dark:text-slate-400">Include closed</span>
            <Switch checked={hide} onCheckedChange={() => setHide((prev) => !prev)} />
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
