import { Tab } from '@headlessui/react'
import { UserWithFarm } from '@sushiswap/graph-client/.graphclient'
import { Chip, classNames, Network } from '@sushiswap/ui'
import { FC } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { usePoolFilters } from '../PoolsFiltersProvider'
import { PoolsTable, PositionsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'

export const PoolsSection: FC = () => {
  const { selectedNetworks, setFilters } = usePoolFilters()
  const { address } = useAccount()
  const { data: userWithFarms } = useSWR<UserWithFarm[]>(address ? [`/earn/api/user/${address}`] : null, (url) =>
    fetch(url).then((response) => response.json())
  )

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
            All Yields
          </Tab>

          {address && (
            <Tab
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200' : 'text-slate-500',
                  'hover:text-slate-50 focus:text-slate-50 flex items-center gap-2 font-medium !outline-none'
                )
              }
            >
              My Positions <Chip label={userWithFarms?.length || '0'} size="sm" color="blue" />
            </Tab>
          )}
        </div>
        <TableFilters />
        <Network.Selector
          networks={SUPPORTED_CHAIN_IDS}
          selectedNetworks={selectedNetworks}
          onChange={(selectedNetworks) => setFilters({ selectedNetworks })}
        />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PoolsTable />
          </Tab.Panel>
          <Tab.Panel unmount={!address}>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
