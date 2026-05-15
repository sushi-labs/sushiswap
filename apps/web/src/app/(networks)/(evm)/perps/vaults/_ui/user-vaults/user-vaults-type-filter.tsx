import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { SortIcon } from '@sushiswap/ui/icons/SortIcon'
import { useCallback } from 'react'
import {
  USER_VAULTS_FILTERS,
  type UserVaultsFilterType,
  useUserVaultsState,
} from './user-vaults-provider'

export const UserVaultsTypeFilter = () => {
  const {
    state: { filter },
    mutate: { setFilter },
  } = useUserVaultsState()

  const selectedFilters = filter.length ? filter : [...USER_VAULTS_FILTERS]

  const toggleFilter = useCallback(
    (type: UserVaultsFilterType) => {
      const isSelected = selectedFilters.includes(type)

      const nextFilter = isSelected
        ? selectedFilters.filter((filterType) => filterType !== type)
        : [...selectedFilters, type]

      // At least one filter must stay selected
      if (nextFilter.length === 0) return

      setFilter(nextFilter)
    },
    [selectedFilters, setFilter],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="perps-secondary"
          size="sm"
          aria-label="Table Filter Select"
          className="!rounded-xl !text-perps-muted-50"
        >
          <div className="flex items-center gap-1">
            <div className="!text-perps-muted-70 capitalize">
              {selectedFilters.join(', ')}
            </div>
            <SortIcon width={16} height={16} />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="!bg-black/10">
        {USER_VAULTS_FILTERS.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedFilters.includes(type)}
            onCheckedChange={() => toggleFilter(type)}
            className="capitalize"
            onSelect={(e) => e.preventDefault()}
          >
            {type}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
