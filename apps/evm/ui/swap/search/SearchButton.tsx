import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import React, { FC, useCallback } from 'react'

import { useSearchContext } from './SearchProvider'

export const SearchButton: FC = () => {
  const { setOpen } = useSearchContext()

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return <IconButton icon={MagnifyingGlassIcon} onClick={onClick} name="Search" variant="ghost" />
}
