import { Listbox } from '@headlessui/react'
import classNames from 'classnames'
import { FC, forwardRef } from 'react'

import { ExtractProps } from '../types'

export type SelectOptionsProps = ExtractProps<typeof Listbox.Options>

const SelectOptions: FC<SelectOptionsProps> = forwardRef(({ className, ...props }, ref) => {
  return (
    <Listbox.Options
      ref={ref}
      className={classNames(
        'absolute z-[100] w-full mt-2 bg-slate-600 overflow-auto shadow-lg shadow-black/20 hide-scrollbar max-h-60 rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none'
      )}
      {...props}
    />
  )
})

export default SelectOptions
