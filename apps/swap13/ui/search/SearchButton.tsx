import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { FC, useCallback } from 'react'

import { useSearchContext } from './SearchProvider'

export const SearchButton: FC = () => {
  const { setOpen } = useSearchContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <MagnifyingGlassIcon
      onClick={onClick}
      className="w-5 h-5 text-gray-700 hover:text-gray-900 dark:text-slate-300 hover:dark:text-white cursor-pointer mr-2"
    />
  )
}
