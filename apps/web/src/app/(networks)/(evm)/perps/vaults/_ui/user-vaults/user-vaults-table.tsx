'use client'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { UserVaultsFilters } from './user-vaults-filters'

export const UserVaultsTable = () => {
  return (
    <PerpsCard className="p-3 gap-4 flex flex-col">
      <div className="flex justify-between flex-wrap gap-2">
        <h3 className="font-medium">User Vaults</h3>
        <UserVaultsFilters />
      </div>
      <div>Table</div>
    </PerpsCard>
  )
}
