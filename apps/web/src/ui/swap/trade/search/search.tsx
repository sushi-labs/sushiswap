import { Button } from '@sushiswap/ui'
import { FavoriteDialog } from '../favorite-recent/favorite-dialog'
import { Wrapper } from '../wrapper'
import { AvailableTokens } from './available-tokens'
import { SearchBar } from './search-bar'
import { useSearchContext } from './search-provider'

export const Search = () => {
  const {
    state: { searchValue },
  } = useSearchContext()
  return (
    <Wrapper>
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Button variant="quaternary">Available</Button>
            <FavoriteDialog />
            <Button variant="ghost">Recent</Button>
          </div>

          <SearchBar />
        </div>
        <div className="overflow-x-auto">
          <AvailableTokens />
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-4">
        <SearchBar />
        {searchValue === '' ? <AvailableTokens /> : null}
      </div>
    </Wrapper>
  )
}
