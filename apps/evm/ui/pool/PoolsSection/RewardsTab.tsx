import { Tab } from '@headlessui/react'
import { Container } from '@sushiswap/ui/components/container'
import { Toggle } from '@sushiswap/ui/components/toggle'
import React, { Fragment, useState } from 'react'

import { RewardsSection } from '../RewardsSection'

export const RewardsTab = () => {
  const [tabPositions, setTabPositions] = useState<number>(0)

  return (
    <Tab.Group defaultIndex={0} selectedIndex={tabPositions} onChange={setTabPositions}>
      <Container maxWidth="7xl" className="px-4 mx-auto">
        <div className="flex items-center gap-2 mb-4">
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
        </div>
      </Container>
      <Tab.Panels className="mt-4">
        <Tab.Panel>
          <RewardsSection />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}
