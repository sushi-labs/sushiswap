import { Transition } from '@headlessui/react'
import { PlusIcon, SearchIcon, XCircleIcon } from '@heroicons/react/solid'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, IconButton } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../../PoolsProvider'

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
        setFilters({ extraQuery: '' })
      }, 750)
    }
  }, [extra, setFilters])

  return (
    <div
      className={classNames(
        'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 pr-4 bg-slate-800 rounded-2xl h-12'
      )}
    >
      <div
        className={classNames(
          _query ? 'pr-8' : 'pr-4',
          'w-full sm:w-[240px] flex-grow pr-4 transform-all relative flex gap-2 items-center px-4 py-2.5 rounded-2xl'
        )}
      >
        <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
          <SearchIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
        </div>

        <input
          value={_query}
          placeholder="Search a token"
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
          type="text"
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <Transition
          appear
          show={_query?.length > 0}
          className="absolute top-0 bottom-0 right-0 flex items-center"
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
      <div className="h-full py-3">
        <div className="w-px h-full bg-slate-200/20" />
      </div>
      <Transition
        show={extra}
        unmount={false}
        className="transition-[max-width] overflow-hidden"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-w-0"
        enterTo="transform max-w-[120px]"
        leave="transition-[max-width] duration-250 ease-in-out"
        leaveFrom="transform max-w-[120px]"
        leaveTo="transform max-w-0"
      >
        <input
          placeholder="... other token"
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-[200px] !text-base placeholder:text-sm')}
          type="text"
          onInput={(e) => setExtraQuery(e.currentTarget.value)}
        />
      </Transition>
      <IconButton onClick={() => setExtra((prev) => !prev)}>
        <PlusIcon
          width={20}
          height={20}
          className={classNames(
            extra ? 'rotate-45' : '',
            'transition-[transform] ease-in-out rotate-0 text-slate-400 group-hover:text-slate-200 delay-[400ms]'
          )}
        />
      </IconButton>
    </div>
  )
}
