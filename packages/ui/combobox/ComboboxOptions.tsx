import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type ComboboxOptionsProps = ExtractProps<typeof HeadlessCombobox.Options> & {}

const ComboboxOptions: FC<ComboboxOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <HeadlessCombobox.Options
      ref={ref}
      className="z-10 hide-scrollbar absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      {...props}
    />
  )
})

export default ComboboxOptions
