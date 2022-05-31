import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { FC } from 'react'
import { Search as SearchIcon } from 'react-feather'

interface Search {
  term?: string
  search(value: string): void
}

const Search: FC<Search> = ({ term, search }) => {
  const { i18n } = useLingui()

  return (
    <div className="flex flex-grow items-center gap-4 w-full sm:w-auto">
      <div className="focus-within:ring-2 ring-blue flex flex-grow gap-2 items-center rounded border border-dark-800 bg-dark-900 bg-opacity-50 py-2 px-3 w-full sm:w-auto">
        <SearchIcon strokeWidth={3} width={20} height={20} />
        <input
          className="bg-transparent text-high-emphesis w-full placeholder:text-low-emphesis"
          placeholder={i18n._(t`Search by token or pair`)}
          onChange={(e) => search(e.target.value)}
          value={term}
        />
      </div>
    </div>
  )
}

export default Search
