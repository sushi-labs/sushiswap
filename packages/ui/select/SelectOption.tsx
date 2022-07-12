import { Listbox } from '@headlessui/react'
import classNames from 'classnames'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type SelectOptionProps = ExtractProps<typeof Listbox.Option> & {
  children?: string
}

const SelectOption: FC<SelectOptionProps> = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <Listbox.Option
      ref={ref}
      {...props}
      className={({ active }: { active: boolean }) =>
        classNames(
          active ? 'text-white bg-blue-500' : 'text-high-emphesis',
          'flex gap-2 px-4 items-center font-medium text-sm cursor-default select-none relative py-2 rounded-xl border-[3px] border-slate-600 whitespace-nowrap',
          className
        )
      }
    >
      {children}
    </Listbox.Option>
  )
})

export default SelectOption
