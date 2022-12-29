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
        className,
        'absolute z-[100] w-full mt-3 bg-slate-800 overflow-auto shadow-lg shadow-black/50 p-2 scroll overflow-x-hidden max-h-60 rounded-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'
      )}
      {...props}
    />
  )
})

export default SelectOptions
