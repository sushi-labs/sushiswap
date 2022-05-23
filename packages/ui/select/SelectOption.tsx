import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
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
      className={({ active, selected }: { active: boolean; selected: boolean }) =>
        classNames(
          active ? 'text-white bg-blue-500' : 'text-high-emphesis',
          'flex gap-2 px-4 items-center font-bold text-sm cursor-default select-none relative py-2 rounded-xl border-[3px] border-slate-800 whitespace-nowrap',
          className,
        )
      }
    >
      {children}
    </Listbox.Option>
  )
})

export default SelectOption
