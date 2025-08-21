import { OpenOrdersNetworkFilter } from './open-orders-network-filter'
import { OpenOrdersSearch } from './open-orders-search'

export const OpenOrdersTableFilters = () => {
  return (
    <div className="flex gap-2 items-center">
      <OpenOrdersSearch />
      <OpenOrdersNetworkFilter />
    </div>
  )
}
