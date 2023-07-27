import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import { Button } from '@sushiswap/ui/future/components/button'
import { PoolsTable } from 'app/pool/PoolsSection/Tables/PoolsTable'
import { PositionsTable } from 'app/pool/PoolsSection/Tables/PositionsTable'
import { PoolFilters } from 'app/pool/PoolsSection/Tables/TableFilters/PoolFilters'
import React, { FC, Fragment, useState } from 'react'

export default function PoolsSection() {
  const [tab, setTab] = useState<number>(0)
  const { account } = useWallet()
  return (
    <div className="flex flex-col">
      <Tab.Group defaultIndex={0} selectedIndex={tab} onChange={setTab}>
        <Container maxWidth="7xl" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <Button
                  size="sm"
                  variant={selected ? 'outlined' : 'empty'}
                  color="bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12]"
                  className="!rounded-full !h-[36px] !font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
                >
                  All
                </Button>
              )}
            </Tab>
            {account?.address && (
              <>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <Button
                      size="sm"
                      variant={selected ? 'outlined' : 'empty'}
                      color="default"
                      testId="my-positions"
                      className="!rounded-full !h-[36px]"
                    >
                      My Positions
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
                      testId="my-rewards"
                    >
                      My Rewards
                    </Button>
                  )}
                </Tab>
              </>
            )}
          </div>
        </Container>
        <Tab.Panels className="bg-gray-50 dark:bg-white/[0.02] py-4">
          <Container maxWidth="7xl" className="px-4 mx-auto">
            <PoolFilters showCategories={tab === 0} />
          </Container>
          <Tab.Panel>
            <Container maxWidth="7xl" className="px-4 mx-auto">
              <PoolsTable />
              {/* Pools Table */}
            </Container>
          </Tab.Panel>
          <Tab.Panel>
            <PositionsTable />
          </Tab.Panel>
          <Tab.Panel></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
