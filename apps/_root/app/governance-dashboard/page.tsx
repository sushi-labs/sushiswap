'use client'

import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'

import { Finance, Governance, Hero, Overview, TokenHolders } from './components'

export default function GovernanceDashboard() {
  return (
    <Tab.Group>
      <Hero />
      <Container maxWidth="6xl" className="mx-auto py-14 px-4">
        <Tab.Panels>
          {/** TODO: order */}
          <Tab.Panel>
            <Overview />
          </Tab.Panel>
          <Tab.Panel>
            <Finance />
          </Tab.Panel>
          <Tab.Panel>
            <Governance />
          </Tab.Panel>
          <Tab.Panel>
            <TokenHolders />
          </Tab.Panel>
        </Tab.Panels>
      </Container>
    </Tab.Group>
  )
}
