import React, { FC } from 'react'

import { Typography } from '../typography'
import { FormButtons } from './FormButtons'
import { FormControl } from './FormControl'
import { FormSection } from './FormSection'

interface Form {
  header: string
  children: React.ReactElement<typeof FormSection> | React.ReactElement<typeof FormSection>[]
}

const FormRoot: FC<Form> = ({ header, children }) => {
  return (
    <div className="gap-x-10 divide-y divide-slate-800">
      <Typography variant="h3" className="text-slate-50 py-6">
        {header}
      </Typography>
      <div className="divide-y divide-slate-800">{children}</div>
    </div>
  )
}

export const Form: typeof FormRoot & {
  Buttons: typeof FormButtons
  Control: typeof FormControl
  Section: typeof FormSection
} = Object.assign(FormRoot, {
  Buttons: FormButtons,
  Control: FormControl,
  Section: FormSection,
})
