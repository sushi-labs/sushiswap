import { Tab } from '@headlessui/react'
import { classNames, Network } from '@sushiswap/ui'
import { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { PairTable } from '../PairTable'
import { usePoolFilters } from '../PoolsFiltersProvider'
import { TableFilters } from '../Table/TableFilters'
import { TokenTable } from '../TokenTable'

export const TableSection: FC = () => {
  const { selectedNetworks, setFilters } = usePoolFilters()

  return (
    <section className="flex flex-col gap-6">
      <Tab.Group>
        <div className="flex items-center gap-6">
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-200' : 'text-slate-500',
                'hover:text-slate-50 focus:text-slate-50 font-medium !outline-none'
              )
            }
          >
            Top Markets
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-200' : 'text-slate-500',
                'hover:text-slate-50 focus:text-slate-50 font-medium !outline-none'
              )
            }
          >
            Top Tokens
          </Tab>
        </div>
        <TableFilters />
        <Network.Selector
          networks={SUPPORTED_CHAIN_IDS}
          selectedNetworks={selectedNetworks}
          onChange={(selectedNetworks) => setFilters({ selectedNetworks })}
        />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PairTable />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
