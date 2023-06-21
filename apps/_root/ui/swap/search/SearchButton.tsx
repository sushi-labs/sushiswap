import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { FC, useCallback } from 'react'

import { useSearchContext } from './SearchProvider'
import { IconButton } from '@sushiswap/ui/future/components/iconbutton'

export const SearchButton: FC = () => {
  const { setOpen } = useSearchContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return <IconButton icon={MagnifyingGlassIcon} onClick={onClick} name="Search" variant="ghost" />
}
