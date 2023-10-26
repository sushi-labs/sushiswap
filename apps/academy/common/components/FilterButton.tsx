import { FC } from 'react'

import { Maybe } from '../../.mesh'
import { Button } from '@sushiswap/ui/components/button'

interface FilterButton {
  isSelected: boolean
  title: Maybe<string> | undefined
  onClick: () => void
}

export const FilterButton: FC<FilterButton> = ({
  title,
  isSelected,
  onClick,
}) => {
  return (
    <Button onClick={onClick} color={isSelected ? 'blue' : 'default'}>
      {title}
    </Button>
  )
}
