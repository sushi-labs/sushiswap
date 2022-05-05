import { Listbox } from '@headlessui/react'
import { FC, forwardRef } from 'react'
import { ExtractProps } from '../types'
import classNames from 'classnames'
import { CheckIcon } from '@heroicons/react/outline'

export type SelectOptionProps = ExtractProps<typeof Listbox.Option> & {
  children?: string
}

const SelectOption: FC<SelectOptionProps> = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <Listbox.Option
      ref={ref}
      {...props}
      className={({ active }) =>
        classNames(
          active ? 'text-blue-100 bg-blue-500 bg-opacity-50' : 'text-high-emphesis',
          'font-bold text-sm cursor-default select-none relative py-2 pl-4 pr-9 rounded-xl border-[3px] border-dark-800',
          className,
        )
      }
    >
      {({ selected }) => (
        <>
          {selected && <CheckIcon width={24} height={24} />}
          {children}
        </>
      )}
    </Listbox.Option>
  )
})

export default SelectOption
