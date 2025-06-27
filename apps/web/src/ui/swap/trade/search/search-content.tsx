import { XIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
  Collapsible,
  IconButton,
  SkeletonBox,
  SkeletonCircle,
  TextField,
  classNames,
} from '@sushiswap/ui'
import { type ChangeEvent, useEffect } from 'react'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useSearchTokens } from 'src/lib/hooks/react-query/search-tokens/useSearchTokens'
import { useAccount } from 'wagmi'
import { SearchItem } from './search-item'
import { useSearchContext } from './search-provider'

export const SearchContent = () => {
  const {
    state: { searchValue },
    mutate: { setSearchValue, clearSearchValue },
  } = useSearchContext()

  const { address } = useAccount()

  const {
    data: tokens = [],
    isLoading,
    isError,
  } = useSearchTokens({
    walletAddress: address,
    chainIds: TempChainIds,
    search: searchValue,
    first: 20,
  })

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
      <Collapsible open={!!searchValue}>
        <div className="overflow-y-auto hide-scrollbar text-xs max-h-[calc(100vh-220px)] md:max-h-[250px] grid grid-cols-[30px_auto_auto_auto] gap-2">
          <div className="sticky font-medium grid grid-cols-[30px_190px_auto_auto] col-span-4 top-0 z-10 bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800 text-xs text-[#535263] dark:text-[#E4DDEC]">
            <div />
            <div className="w-full mr-auto">Token</div>
            <div className="w-full ml-auto text-right">Price</div>
            <div className="ml-auto w-full text-right pr-1.5">Holdings</div>
          </div>

          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`search-item-skeleton-${i}`}
                className="grid col-span-4 grid-cols-[30px_200px_auto_auto] py-2 h-[50px] pr-2 rounded-lg animate-pulse"
              >
                <div className="flex items-center justify-center">
                  <SkeletonBox className="w-4 h-4 rounded-full" />
                </div>

                <div className="flex items-center gap-3.5 w-full">
                  <div className="relative">
                    <SkeletonCircle radius={32} />
                    <SkeletonBox className="w-4 h-4 rounded-sm absolute -bottom-[15%] -right-[25%]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <SkeletonBox className="w-12 h-3 rounded" />
                    <SkeletonBox className="w-20 h-2 rounded" />
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center w-[80px] ml-auto">
                  <SkeletonBox className="w-12 h-3 mb-1 rounded" />
                  <SkeletonBox className="w-10 h-2 rounded" />
                </div>

                <div className="flex flex-col items-end justify-center w-[109px] ml-auto">
                  <SkeletonBox className="h-3 mb-1 rounded w-14" />
                  <SkeletonBox className="w-16 h-2 rounded" />
                </div>
              </div>
            ))}

          {isError && (
            <div className="col-span-4 py-4 text-center">
              Shoot! Something went wrong :(
            </div>
          )}

          {!isLoading &&
            !isError &&
            tokens.map((token) => (
              <SearchItem
                key={`search-token-${token.chainId}-${token.address}`}
                token={token}
              />
            ))}

          {!isLoading && !isError && tokens.length === 0 && searchValue && (
            <div className="col-span-4 py-4 text-center">
              No results for “{searchValue}”
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  )
}
