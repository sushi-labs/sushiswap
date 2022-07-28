import { Chip, classNames } from '@sushiswap/ui'
import { FC, useState } from 'react'

import { PoolsTable } from './PoolsTable'
import { PoolsTableFilters } from './PoolsTableFilters'

export const PoolsSection: FC = () => {
  const [selected, setSelected] = useState(0)
  const positions = 2
  const opportunities = 2

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-12 items-center">
        <button
          onClick={() => setSelected(0)}
          className={classNames(selected === 0 ? 'text-slate-50' : 'text-slate-500', 'font-medium')}
        >
          All Yields
        </button>
        <button
          onClick={() => setSelected(1)}
          className={classNames(selected === 1 ? 'text-slate-50' : 'text-slate-500', 'font-medium')}
        >
          My Positions {positions > 0 && <Chip label="4" color="blue" />}
        </button>
        <button
          onClick={() => setSelected(2)}
          className={classNames(selected === 2 ? 'text-slate-50' : 'text-slate-500', 'font-medium')}
        >
          Missed Opportunity {opportunities > 0 && <Chip label="2" color="pink" />}
        </button>
      </div>
      <PoolsTableFilters />
      <PoolsTable />
    </section>
  )
}
