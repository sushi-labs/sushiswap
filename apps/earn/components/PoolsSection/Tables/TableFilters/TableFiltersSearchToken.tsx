import { Transition } from '@headlessui/react'
import { SearchIcon, XCircleIcon } from '@heroicons/react/solid'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, IconButton } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'

export const TableFiltersSearchToken: FC = () => {
  const { setFilters } = usePoolFilters()

  const [_query, setQuery] = useState<string>('')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra, setExtra] = useState(false)

  const debouncedQuery = useDebounce(_query, 400)
  const debouncedExtraQuery = useDebounce(_extraQuery, 400)

  useEffect(() => {
    setFilters({ query: debouncedQuery })
  }, [debouncedQuery, setFilters])

  useEffect(() => {
    setFilters({ extraQuery: debouncedExtraQuery })
  }, [debouncedExtraQuery, setFilters])

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setExtraQuery('')
      }, 750)
    }
  }, [extra, setFilters])

  return (
    <div
      className={classNames(
        'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 bg-slate-800 rounded-xl h-[44px] border border-slate-700'
      )}
    >
      <div className={classNames('w-full sm:w-[240px] flex-grow flex gap-2 items-center px-2 py-2.5 rounded-2xl')}>
        <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
          <SearchIcon className="text-slate-400" strokeWidth={2} width={24} height={24} />
        </div>
        <input
          value={_query}
          placeholder="Filter tokens"
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
          type="text"
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <Transition
          appear
          show={_query?.length > 0}
          className="flex items-center"
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform scale-90 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <IconButton onClick={() => setQuery('')}>
            <XCircleIcon width={20} height={20} className="cursor-pointer text-slate-500 hover:text-slate-300" />
          </IconButton>
        </Transition>
      </div>
    </div>
  )
}
