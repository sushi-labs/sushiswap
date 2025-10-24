import { XIcon } from '@heroicons/react-v1/solid'
import { IconButton, TextField, classNames } from '@sushiswap/ui'
import { useState } from 'react'

export const OpenOrdersSearch = () => {
  // const {
  //   state: { searchValue },
  //   mutate: { setSearchValue, clearSearchValue },
  // } = useSearchContext()
  const [searchValue, setSearchValue] = useState('')
  const clearSearchValue = () => setSearchValue('')

  return (
    <div className="relative">
      <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        variant="naked"
        placeholder="Search"
        size="sm"
        className={classNames(
          'pl-4 pr-8 !min-h-[36px] !h-[36px] !max-h-[36px] placeholder:text-muted-foreground !dark:text-slate-500 placeholder:dark:text-slate-450 rounded-lg w-full dark:!bg-slate-750 !bg-slate-200',
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
  )
}
