import { Listbox } from '@headlessui/react'
import React, { FC, Fragment } from 'react'
import { ExtractProps } from '../types'
import { Typography } from '../typography'
import classNames from 'classnames'

export type SelectLabelProps = ExtractProps<typeof Listbox.Label> & {
  children: string
  standalone?: boolean
}

const SelectLabel: FC<SelectLabelProps> = ({ className, children, standalone, ...props }) => {
  return React.createElement(
    standalone ? 'div' : Listbox.Label,
    {
      ...props,
      as: Fragment,
    },
    <Typography variant="sm" weight={500} className={classNames(className, 'text-high-emphesis')}>
      {children}
    </Typography>,
  )
}

export default SelectLabel
