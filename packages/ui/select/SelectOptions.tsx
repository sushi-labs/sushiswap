import { Listbox } from '@headlessui/react'
import { FC, forwardRef } from 'react'
import { ExtractProps } from '../types'

export type SelectOptionsProps = ExtractProps<typeof Listbox.Options> & {}

const SelectOptions: FC<SelectOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <Listbox.Options
      ref={ref}
      className="z-10 hide-scrollbar absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      {...props}
    />
  )
})

export default SelectOptions
