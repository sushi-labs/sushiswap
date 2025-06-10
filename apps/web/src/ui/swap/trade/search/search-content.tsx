import { XIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Collapsible, IconButton, TextField, classNames } from '@sushiswap/ui'
import { SearchItem } from './search-item'
import { useSearchContext } from './search-provider'

export const SearchContent = () => {
  const {
    state: { searchValue },
    mutate: { setSearchValue, clearSearchValue },
  } = useSearchContext()

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <TextField
          icon={MagnifyingGlassIcon}
          iconProps={{ widths: 15 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
          {/* TODO: loading state */}
          {/* TODO: error state */}
          <div className="sticky font-medium grid grid-cols-[30px_190px_auto_auto] col-span-4 top-0 z-10 bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800 text-xs text-[#535263] dark:text-pink-100">
            <div />
            <div className="w-full mr-auto">Token</div>
            <div className="w-full ml-auto text-right">Price</div>
            <div className="ml-auto w-full text-right pr-1.5">Holdings</div>
          </div>

          <SearchItem />
          <SearchItem />
          <SearchItem />
          <SearchItem />
        </div>
      </Collapsible>
    </div>
  )
}
