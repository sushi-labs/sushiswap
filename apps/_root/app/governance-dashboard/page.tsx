'use client'

import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import React from 'react'

import { Hero, Overview } from './components'

export default function GovernanceDashboard() {
  return (
    <Tab.Group>
      <Hero />
      <Container maxWidth="6xl" className="py-14 mx-auto px-4">
        <Tab.Panels>
          <Tab.Panel>
            <Overview />
          </Tab.Panel>
          <Tab.Panel>2</Tab.Panel>
          <Tab.Panel>3</Tab.Panel>
          <Tab.Panel>4</Tab.Panel>
        </Tab.Panels>
      </Container>
    </Tab.Group>
  )
}
