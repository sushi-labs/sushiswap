import React, { FC } from 'react'

import { Typography } from '../typography'
import { FormControl } from './FormControl'

interface FormSection {
  title: string
  description: string
  children: React.ReactElement<typeof FormControl> | React.ReactElement<typeof FormControl>[] | undefined | null | false
}

export const FormSection: FC<FormSection> = ({ title, description, children }) => {
  return (
    <div className="grid grid-cols-3 gap-x-10 py-2">
      <div className="col-span-3 md:col-span-1 space-y-3 py-4">
        <Typography variant="lg" className="text-slate-200">
          {title}
        </Typography>
        <Typography variant="sm" className="text-slate-400">
          {description}
        </Typography>
      </div>
      <div className="col-span-3 md:col-span-2 space-y-6 py-4">{children}</div>
    </div>
  )
}
