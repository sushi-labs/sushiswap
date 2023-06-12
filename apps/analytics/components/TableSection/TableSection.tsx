import { Tab } from '@headlessui/react'
import React, { FC, Fragment } from 'react'

import { PoolTable } from './Pools'
import { Button } from '@sushiswap/ui/future/components/button'
// import { TokenTable } from './Tokens'
import { FuroTokenTable } from './FuroTokens'

export const TableSection: FC = () => {
  return (
    <section className="flex flex-col">
      <Tab.Group>
        <div className="flex items-center gap-2 mb-4">
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                SushiSwap
              </Button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                SushiPay
              </Button>
            )}
          </Tab>
          {/* <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Sushi Vault
              </Button>
            )}
          </Tab> */}
          {process.env.NODE_ENV !== 'production' ? (
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                  Uknown Pools
                </Button>
              )}
            </Tab>
          ) : null}
          {/* <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default">
                Tokens
              </Button>
            )}
          </Tab> */}
        </div>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PoolTable />
          </Tab.Panel>
          {/* <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel> */}
          <Tab.Panel unmount={false}>
            <FuroTokenTable />
          </Tab.Panel>
          {process.env.NODE_ENV !== 'production' ? (
            <Tab.Panel unmount={false}>
              <PoolTable isWhitelisted={false} />
            </Tab.Panel>
          ) : null}
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
