import { Tab } from '@headlessui/react'
import { Container } from '@sushiswap/ui/components/container'
import { Toggle } from '@sushiswap/ui/components/toggle'
import React, { FC, Fragment } from 'react'

import { BentoBoxTokenTable } from './BentoBoxTokens'
import { FuroTokenTable } from './FuroTokens'
import { Pools } from './Pools'

export const TableSection: FC = () => {
  return (
    <section className="flex flex-col">
      <Tab.Group>
        <Container maxWidth="7xl" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  SushiSwap 🍣
                </Toggle>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  SushiPay 💸
                </Toggle>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Toggle size="sm" pressed={selected}>
                  Sushi Vault 🏦
                </Toggle>
              )}
            </Tab>
          </div>
        </Container>
        <Tab.Panels className="bg-gray-50 dark:bg-white/[0.02] pt-4">
          <Tab.Panel unmount={false}>
            <Pools />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <FuroTokenTable />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <BentoBoxTokenTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
