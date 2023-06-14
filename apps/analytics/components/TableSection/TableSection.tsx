import { Tab } from '@headlessui/react'
import React, { FC, Fragment } from 'react'

import { Pools } from './Pools'
import { Button } from '@sushiswap/ui/future/components/button'
// import { TokenTable } from './Tokens'
import Container from '@sushiswap/ui/future/components/Container'
import { FuroTokenTable } from './FuroTokens'
import { BentoBoxTokenTable } from './BentoBoxTokens'

export const TableSection: FC = () => {
  return (
    <section className="flex flex-col">
      <Tab.Group>
        <Container maxWidth="7xl" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button
                  size="sm"
                  variant={selected ? 'outlined' : 'empty'}
                  color="default"
                  className="!rounded-full !h-[36px]"
                >
                  SushiSwap 🍣
                </Button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button
                  size="sm"
                  variant={selected ? 'outlined' : 'empty'}
                  color="default"
                  className="!rounded-full !h-[36px]"
                >
                  SushiPay 💸
                </Button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button
                  size="sm"
                  variant={selected ? 'outlined' : 'empty'}
                  color="default"
                  className="!rounded-full !h-[36px]"
                >
                  Sushi Vault 🏦
                </Button>
              )}
            </Tab>

            {/* <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default" >
                Tokens
              </Button>
            )}
          </Tab> */}
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
