'use client'

import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import React, { ReactNode } from 'react'

import { Finance, Governance, Overview, TokenHolders } from './'

export function Main({ children }: { children?: ReactNode }) {
  return (
    <Tab.Group>
      {children}
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
