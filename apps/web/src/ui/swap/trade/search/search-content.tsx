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
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <SearchSkeleton key={idx} />
                ))}
            </div>
          ) : isError ? (
            <div className="text-center text-sm text-red mt-8">
              An error occurred loading search results
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center font-medium text-sm mt-8">
              No results for “{searchValue}”
            </div>
          ) : (
            <div className="text-xs grid grid-cols-[30px_auto_auto_auto] gap-2">
              <div className="sticky font-medium grid grid-cols-[30px_190px_auto_auto] col-span-4 top-0 z-[19] bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800 text-xs text-[#535263] dark:text-[#E4DDEC]">
                <div />
                <div className="w-full mr-auto">Token</div>
                <div className="w-full ml-auto text-right">Price</div>
                <div className="ml-auto w-full text-right pr-1.5">Holdings</div>
              </div>

              {tokens?.map((token) => (
                <SearchItem
                  key={`search-token-${token.chainId}-${token.address}`}
                  token={token}
                />
              ))}
            </div>
          )}
        </InfiniteScroll>
      </Collapsible>
    </div>
  )
}

const SearchSkeleton = () => {
  return (
    <div className="text-xs flex items-center gap-2 justify-between">
      <div className="max-w-[25px] py-3 md:py-4">
        <SkeletonBox className="w-3 h-3 rounded-sm" />
      </div>
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <SkeletonCircle radius={32} />
          <SkeletonBox className="w-3 h-3 rounded-sm absolute -right-[3%] -bottom-[3%]" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <SkeletonBox className="w-10 h-3 rounded-sm" />
          <SkeletonBox className="w-24 h-3 rounded-sm" />
        </div>
      </div>

      <div className="block mx-auto">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-slate-900 dark:text-pink-100">
            <SkeletonBox className="w-10 h-3 rounded-sm" />
          </span>
          <span className={classNames('font-medium')}>
            <SkeletonBox className="w-8 h-3 rounded-sm" />
          </span>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-0.5 items-end ml-auto">
          <span className="text-slate-900 dark:text-pink-100 !font-medium">
            <SkeletonBox className="w-12 md:w-16 h-3 rounded-sm" />
          </span>
          <span className="text-muted-foreground">
            <SkeletonBox className="w-16 md:w-20 h-3 rounded-sm" />
          </span>
        </div>
      </div>
    </div>
  )
}
