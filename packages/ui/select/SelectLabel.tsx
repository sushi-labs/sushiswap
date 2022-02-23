import { Listbox } from '@headlessui/react'
import { FC } from 'react'
import { ExtractProps } from '../types'
import { classNames } from '../lib/classNames'

export type SelectLabelProps = ExtractProps<typeof Listbox.Label> & {}
const SelectLabel: FC<SelectLabelProps> = ({ className, ...props }) => {
  return (
    <Listbox.Label
      {...props}
      className={classNames(className, 'block text-sm font-medium text-slate-500 dark:text-slate-400')}
    />
  )
}

export default SelectLabel
