import { Tab } from '@headlessui/react'
import { classNames, Network } from '@sushiswap/ui'
import { FC, useCallback } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { PairTable } from '../PairTable'
import { SelectedTable, usePoolFilters } from '../PoolsFiltersProvider'
import { TableFilters } from '../Table/TableFilters'
import { TokenTable } from '../TokenTable'
import { TransactionTable } from '../TransactionTable'

export const TableSection: FC = () => {
  const { selectedNetworks, setFilters, selectedTable } = usePoolFilters()

  const onChange = useCallback(
    (val) => {
      setFilters({
        selectedTable:
          val === 0 ? SelectedTable.Markets : val === 1 ? SelectedTable.Tokens : SelectedTable.Transactions,
      })
    },
    [setFilters]
  )

  return (
    <section className="flex flex-col gap-6">
      <Tab.Group onChange={onChange}>
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
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-200' : 'text-slate-500',
                'hover:text-slate-50 focus:text-slate-50 font-medium !outline-none'
              )
            }
          >
            Transactions
          </Tab>
        </div>
        {selectedTable === SelectedTable.Transactions ? (
          <Network.SelectorTxn
            networks={SUPPORTED_CHAIN_IDS}
            selectedNetwork={selectedNetworks[0]}
            onChange={(selectedNetwork) =>
              setFilters({ selectedNetworks: selectedNetwork === null ? [] : [selectedNetwork] })
            }
          />
        ) : (
          <>
            <TableFilters />
            <Network.Selector
              networks={SUPPORTED_CHAIN_IDS}
              selectedNetworks={selectedNetworks}
              onChange={(selectedNetworks) => setFilters({ selectedNetworks })}
            />
          </>
        )}
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PairTable />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <TokenTable />
          </Tab.Panel>
          <Tab.Panel unmount={false}>
            <TransactionTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
