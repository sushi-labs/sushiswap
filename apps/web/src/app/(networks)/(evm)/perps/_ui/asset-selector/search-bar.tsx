import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TextField } from '@sushiswap/ui'
import { useAssetSelectorState } from './asset-selector-provider'

export const SearchBar = () => {
  const {
    state: { search },
    mutate: { setSearch },
  } = useAssetSelectorState()
  return (
    <TextField
      placeholder="Search"
      icon={MagnifyingGlassIcon}
      type="text"
      value={search}
      onValueChange={setSearch}
    />
  )
}
