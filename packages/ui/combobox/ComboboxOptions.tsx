import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type ComboboxOptionsProps = ExtractProps<typeof HeadlessCombobox.Options>

const ComboboxOptions: FC<ComboboxOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <HeadlessCombobox.Options
      ref={ref}
      className="absolute z-10 w-full mt-1 overflow-auto shadow-lg hide-scrollbar max-h-60 rounded-xl bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
      {...props}
    />
  )
})

export default ComboboxOptions
