import Container from '@sushiswap/ui/future/components/Container'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { Native, SUSHI } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui'
import React, { Fragment, useState } from 'react'
import { PositionCardList } from '../../components/MigratePage/PositionCardList'
import { RadioGroup } from '@headlessui/react'
import { ViewGridIcon, ViewListIcon } from '@heroicons/react/outline'
import { PositionTable } from '../../components/MigratePage/PositionTable'

enum View {
  grid,
  list,
}

const Migrate = () => {
  const [view, setView] = useState(View.grid)

  return (
    <>
      <div className="relative max-h-[308px] overflow-hidden border-t border-gray-300 dark:border-slate-700">
        <div className="relative bg-gray-200/50 dark:bg-slate-800/50 py-20 paper z-10">
          <Container maxWidth="7xl" className="mx-auto">
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-3">
                <h1 className="text-5xl font-semibold leading-[1.08349] tracking-[-.003em]">
                  Migrate for <br /> increased efficiency.
                </h1>
                <span className="text-[21px] flex items-center gap-1 text-blue">
                  Learn more <ChevronRightIcon width={24} height={24} />
                </span>
              </div>
              <div />
            </div>
          </Container>
        </div>
        <div className="absolute flex gap-5 items-center left-0 right-0 top-20 z-0">
          <div className="grid grid-cols-2 w-full">
            <div />
            <div className="flex items-center gap-4">
              <Currency.IconList iconWidth={156} iconHeight={156}>
                <Currency.Icon currency={Native.onChain(ChainId.ETHEREUM)} />
                <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} />
              </Currency.IconList>
              <ChevronRightIcon width={156} height={156} />
            </div>
          </div>
        </div>
      </div>
      <Container maxWidth="7xl" className="mx-auto py-10">
        <div className="flex justify-between items-center py-10">
          <h1 className="text-4xl font-semibold">Available Positions</h1>
          <RadioGroup value={view} onChange={setView}>
            <div className="items-center relative bg-black/[0.04] dark:bg-white/[0.02] ring-4 ring-black/[0.04] dark:ring-white/[0.02] rounded-lg overflow-hidden flex gap-1">
              <RadioGroup.Option as={Fragment} value={View.grid}>
                {({ checked }) => (
                  <button
                    className={classNames(
                      checked
                        ? 'text-gray-900 dark:text-slate-50 bg-white dark:bg-white/[0.08]'
                        : 'text-gray-500 dark:text-slate-500 hover:bg-gray-100 hover:dark:bg-white/[0.04]',
                      'px-2 z-[1] relative rounded-lg text-sm h-8 font-medium flex flex-grow items-center justify-center'
                    )}
                  >
                    <ViewGridIcon width={24} height={24} />
                  </button>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option as={Fragment} value={View.list}>
                {({ checked }) => (
                  <button
                    className={classNames(
                      checked
                        ? 'text-gray-900 dark:text-slate-50 bg-white dark:bg-white/[0.08]'
                        : 'text-gray-500 dark:text-slate-500 hover:bg-gray-100 hover:dark:bg-white/[0.04]',
                      'px-2 z-[1] relative rounded-lg text-sm h-8 font-medium flex flex-grow items-center justify-center'
                    )}
                  >
                    <ViewListIcon width={24} height={24} />
                  </button>
                )}
              </RadioGroup.Option>
            </div>
          </RadioGroup>
        </div>
        {view === View.grid && <PositionCardList />}
        {view === View.list && <PositionTable />}
      </Container>
    </>
  )
}

export default Migrate
