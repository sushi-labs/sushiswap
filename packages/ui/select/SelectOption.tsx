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
      className={({ active, selected }: { active: boolean; selected: boolean }) =>
        classNames(
          active ? 'text-white bg-blue-500' : 'text-high-emphesis',
          selected ? '' : 'pl-[34px]',
          'flex gap-2 px-2 items-center font-bold text-sm cursor-default select-none relative py-2 rounded-xl border-[3px] border-slate-800',
          className,
        )
      }
    >
      {({ selected }: { active: boolean; selected: boolean }) => (
        <>
          {selected && <CheckIcon width={18} height={18} />}
          {children}
        </>
      )}
    </Listbox.Option>
  )
})

export default SelectOption
