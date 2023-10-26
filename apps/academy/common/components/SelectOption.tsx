import { Listbox } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import { FC } from 'react'

import { Maybe } from '../../.mesh'

interface SelectOption {
  value: unknown
  isSelected: boolean
  title: Maybe<string> | undefined
  className?: string
}

export const SelectOption: FC<SelectOption> = ({
  value,
  title,
  isSelected,
  className,
}) => {
  return (
    <Listbox.Option
      value={value}
      className={classNames(
        className,
        'p-2 rounded-lg cursor-pointer hover:bg-blue-500 transform-all',
        isSelected && 'bg-blue-500',
      )}
    >
      {title}
    </Listbox.Option>
  )
}
