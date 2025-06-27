import { XIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
  Collapsible,
  IconButton,
  Loader,
  SkeletonBox,
  SkeletonCircle,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { type ChangeEvent, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useSearchTokens } from 'src/lib/hooks/react-query/search-tokens/useSearchTokens'
import { useAccount } from 'wagmi'
import { SearchItem } from './search-item'
import { useSearchContext } from './search-provider'

export const SearchContent = () => {
  const [open, setOpen] = useState(false)
  const {
    state: { searchValue },
    mutate: { setSearchValue, clearSearchValue },
  } = useSearchContext()

  const { address } = useAccount()

  const {
    data: tokens,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchTokens({
    walletAddress: address,
    chainIds: TempChainIds,
    search: searchValue,
    first: 10,
  })

  useEffect(() => {
    if (searchValue) {
      setOpen(true)
    }
  }, [searchValue])

  console.log('hasNextPage', hasNextPage)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!address) return
    const value = e.target.value
    setSearchValue(value)
  }

  useEffect(() => {
    if (!address) {
      setSearchValue('')
    }
  }, [address, setSearchValue])

  console.log({
    scrollTarget: document.getElementById('token-scroll-container'),
    hasNextPage,
    isFetchingNextPage,
    tokensLength: tokens.length,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <TextField
          icon={MagnifyingGlassIcon}
          iconProps={{ widths: 15 }}
          value={searchValue}
          onChange={handleInputChange}
          type="text"
          variant="naked"
          placeholder="Search by name or address"
          className={classNames(
            'pl-4 pr-8 placeholder:text-slate-450 !dark:text-slate-500 placeholder:dark:text-slate-450 rounded-lg py-1 w-full dark:!bg-slate-800 md:dark:!bg-slate-900 !bg-gray-100',
          )}
        />
        {searchValue ? (
          <IconButton
            variant="ghost"
            size="xxs"
            onClick={clearSearchValue}
            className="!rounded-full p-[1px] dark:text-muted-foreground dark:border-muted-foreground text-[#535263] dark:!bg-slate-900 !bg-gray-100 border-slate-700 absolute right-3 top-1/2 -translate-y-1/2 border"
            icon={() => <XIcon width={16} height={16} />}
            name="Clear Search"
          />
        ) : null}
      </div>

      <Collapsible open={!!searchValue} className="!overflow-auto">
        <InfiniteScroll
          key={open ? 'scroll-open' : 'scroll-closed'}
          height={250}
          dataLength={tokens.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center w-full py-4">
              <Loader size={16} />
            </div>
          }
        >
          <div className="text-xs grid grid-cols-[30px_auto_auto_auto] gap-2">
            <div className="sticky font-medium grid grid-cols-[30px_190px_auto_auto] col-span-4 top-0 z-20 bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800 text-xs text-[#535263] dark:text-[#E4DDEC]">
              <div />
              <div className="w-full mr-auto">Token</div>
              <div className="w-full ml-auto text-right">Price</div>
              <div className="ml-auto w-full text-right pr-1.5">Holdings</div>
            </div>

            {tokens.map((token) => (
              <SearchItem
                key={`search-token-${token.chainId}-${token.address}`}
                token={token}
              />
            ))}
          </div>
        </InfiniteScroll>

        {!isLoading && !isError && tokens.length === 0 && searchValue && (
          <div className="col-span-4 py-4 text-center">
            No results for “{searchValue}”
          </div>
        )}

        {isError && (
          <div className="col-span-4 py-4 text-center">
            Shoot! Something went wrong :(
          </div>
        )}
      </Collapsible>
    </div>
  )
}
