import { Tab } from '@headlessui/react'
import Container from '@sushiswap/ui/future/components/Container'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC } from 'react'

export default function PoolsSection() {
  return (
    <section className="flex flex-col">
      <Tab.Group>
        <Container maxWidth="7xl" className="px-4 mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tab>
              {({ selected }) => (
                <Button
                  size="sm"
                  variant={selected ? 'outlined' : 'empty'}
                  color="default"
                  className="!rounded-full !h-[36px]"
                >
                  All
                </Button>
              )}
            </Tab>
            <Tab>
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
            <Tab>
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
          </div>
        </Container>
        <Tab.Panels className="bg-gray-50 dark:bg-white/[0.02] pt-4"></Tab.Panels>
      </Tab.Group>
    </section>
  )
}
