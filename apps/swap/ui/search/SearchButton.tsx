import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC, useCallback } from 'react'

import { useSearchContext } from './SearchProvider'

export const SearchButton: FC = () => {
  const { setOpen } = useSearchContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Button variant="empty" size="md" color="default" onClick={onClick}>
      <MagnifyingGlassIcon strokeWidth={2} className="w-5 h-5 text-gray-700 dark:text-slate-200" />
    </Button>
  )
}
