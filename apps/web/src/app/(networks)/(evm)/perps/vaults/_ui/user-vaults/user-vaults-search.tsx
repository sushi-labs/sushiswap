import { SearchInput } from '~evm/perps/_ui/_common'
import { useUserVaultsState } from './user-vaults-provider'

export const UserVaultsSearch = () => {
  const {
    state: { search },
    mutate: { setSearch },
  } = useUserVaultsState()

  return <SearchInput value={search} setValue={setSearch} />
}
