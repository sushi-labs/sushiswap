import React, { FC, ReactNode } from 'react'

import { FormControl } from './FormControl'

interface FormSection {
  title: string
  description: ReactNode
  children: React.ReactElement<typeof FormControl> | React.ReactElement<typeof FormControl>[] | undefined | null | false
}

export const FormSection: FC<FormSection> = ({ title, description, children }) => {
  return (
    <div className="grid grid-cols-3 gap-x-10 py-2">
      <div className="col-span-3 md:col-span-1 space-y-3 py-4">
        <p className="text-lg text-gray-900 font-medium dark:text-slate-200">{title}</p>
        <p className="text-gray-600 dark:text-slate-400">{description}</p>
      </div>
      <div className="col-span-3 md:col-span-2 space-y-6 py-4">{children}</div>
    </div>
  )
}
