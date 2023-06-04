import { RewardsSection } from '../RewardsSection'
import React, { Fragment, useState } from 'react'
import { Tab } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import Container from '@sushiswap/ui/future/components/Container'

export const RewardsTab = () => {
  const [tabPositions, setTabPositions] = useState<number>(0)

  return (
    <Tab.Group defaultIndex={0} selectedIndex={tabPositions} onChange={setTabPositions}>
      <Container maxWidth="7xl" className="px-4 mx-auto">
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
