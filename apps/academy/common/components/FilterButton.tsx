import { Button, classNames } from '@sushiswap/ui'
import { FC } from 'react'

import { Maybe } from '../../.mesh'

interface FilterButton {
  isSelected: boolean
  title: Maybe<string> | undefined
  onClick: () => void
}

export const FilterButton: FC<FilterButton> = ({ title, isSelected, onClick }) => {
  return (
    <Button
      size="md"
      onClick={onClick}
      color="gray"
      className={classNames(
        '!px-[14px] sm:!px-4 !h-9 sm:h-10 font-medium !text-xs sm:!text-sm sm:font-normal rounded-full !bg-slate-800 hover:ring-1',
        isSelected ? 'ring-1 focus:ring-1' : 'focus:ring-0 active:ring-1'
      )}
    >
      {title}
    </Button>
  )
}
