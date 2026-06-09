import { UserVaultsPnLTimeframe } from './user-vaults-pnl-timeframe'
import { UserVaultsSearch } from './user-vaults-search'
import { UserVaultsTypeFilter } from './user-vaults-type-filter'

export const UserVaultsFilters = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <UserVaultsSearch />
      <UserVaultsTypeFilter />
      <UserVaultsPnLTimeframe />
    </div>
  )
}
