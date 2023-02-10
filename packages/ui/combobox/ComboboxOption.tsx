import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type ComboboxOptionProps = ExtractProps<typeof HeadlessCombobox.Option> & {
  children?: string
}

const ComboboxOption: FC<ComboboxOptionProps> = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <HeadlessCombobox.Option
      ref={ref}
      {...props}
      className={({ active }: { active: boolean }) =>
        classNames(
          active ? 'text-blue-100 bg-blue-500 bg-opacity-50' : 'text-high-emphesis',
          'font-medium text-sm cursor-default Combobox-none relative py-2 pl-4 pr-9 rounded-xl border-[3px] border-slate-800',
          className
        )
      }
    >
      {({ selected }: { selected: boolean }) => (
        <>
          {selected && <CheckIcon width={24} height={24} />}
          {children}
        </>
      )}
    </HeadlessCombobox.Option>
  )
})

export default ComboboxOption
