import { FC } from 'react'

import { PoolsTable } from './PoolsTable'
import { PoolsTableFilters } from './PoolsTableFilters'

export const PoolsSection: FC = () => {
  return (
    <section className="flex flex-col gap-6">
      <PoolsTableFilters />
      <PoolsTable />
    </section>
  )
}
