import { Tab } from '@headlessui/react'
import { Chip, classNames } from '@sushiswap/ui'
import { FC } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

import { User } from '../../.graphclient'
import { PoolsTable, PositionsTable } from './Tables'
import { TableFilters } from './Tables/TableFilters'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const { data: user } = useSWR<User>(`/pool/api/user/${address}`, (url) =>
    fetch(url).then((response) => response.json())
  )

  return (
    <section className="flex flex-col gap-6">
      <Tab.Group>
        <div className="flex gap-6 items-center">
          <Tab className={({ selected }) => classNames(selected ? 'text-slate-50' : 'text-slate-500', 'font-medium')}>
            All Yields
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(selected ? 'text-slate-50' : 'text-slate-500', 'flex items-center gap-2 font-medium')
            }
          >
            My Positions <Chip label={user?.liquidityPositions?.length || '0'} size="sm" color="blue" />
          </Tab>
        </div>
        <TableFilters />
        <Tab.Panels>
          <Tab.Panel>
            <PoolsTable />
          </Tab.Panel>
          <Tab.Panel>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
