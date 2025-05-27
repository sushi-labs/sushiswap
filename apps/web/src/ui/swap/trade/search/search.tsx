import { useBreakpoint } from '@sushiswap/hooks'
import { Button, Collapsible } from '@sushiswap/ui'
import { Wrapper } from '../wrapper'
import { AvailableTokens } from './available-tokens'
import { SearchBar } from './search-bar'

export const Search = () => {
  const { isMd } = useBreakpoint('md')
  return (
    <Collapsible open={true} disabled={true}>
      <Wrapper>
        {!isMd ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Button variant="quaternary">Available</Button>
                <Button variant="ghost">Favourite</Button>
                <Button variant="ghost">Recent</Button>
              </div>

              <SearchBar />
            </div>
            <div className="overflow-x-auto">
              <AvailableTokens />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <SearchBar />
            <AvailableTokens />
          </div>
        )}
      </Wrapper>
    </Collapsible>
  )
}
