import { Tab } from '@headlessui/react'
import React, { FC, Fragment } from 'react'

import { PoolTable } from './Pools'
import { Button } from '@sushiswap/ui/future/components/button'
// import { TokenTable } from './Tokens'
import Container from '@sushiswap/ui/future/components/Container'
import { FuroTokenTable } from './FuroTokens'

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
            {/* <Tab as={Fragment}>
            {({ selected }) => (
              <Button size="sm" variant={selected ? 'outlined' : 'empty'} color="default"    className="!rounded-full !h-[36px]">
                Sushi Vault
              </Button>
            )}
          </Tab> */}

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
            <Container maxWidth="7xl" className="px-4 mx-auto">
              <Tab.Group>
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
                          <span>🍣</span> <span>All</span>
                        </Button>
                      )}
                    </Tab>
                    {process.env.NODE_ENV !== 'production' ? (
                      <Tab as={Fragment}>
                        {({ selected }) => (
                          <Button
                            size="sm"
                            variant={selected ? 'outlined' : 'empty'}
                            color={selected ? 'blue' : 'default'}
                            className="items-center !gap-2.5"
                          >
                            <span>❓</span> <span>Unlisted</span>
                          </Button>
                        )}
                      </Tab>
                    ) : null}
                    {/* <Tab as={Fragment}>
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
                    </Tab> */}
                  </div>
                </div>
                <Tab.Panels>
                  <Tab.Panel>
                    <PoolTable />
                  </Tab.Panel>
                  {/* <Tab.Panel>
                    <PoolTable />
                  </Tab.Panel>
                  <Tab.Panel>
                    <PoolTable />
                  </Tab.Panel> */}
                  {process.env.NODE_ENV !== 'production' ? (
                    <Tab.Panel unmount={false}>
                      <PoolTable isWhitelisted={false} />
                    </Tab.Panel>
                  ) : null}
                </Tab.Panels>
              </Tab.Group>
            </Container>
            {/* <Container maxWidth="7xl" className="px-4 mx-auto">
              <PoolTable />
            </Container> */}
          </Tab.Panel>
          {/* <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel> */}
          <Tab.Panel unmount={false}>
            <FuroTokenTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
