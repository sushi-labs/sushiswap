import React from 'react'

import { AnyTag, Polymorphic } from '../types'
import { Typography } from '../typography'
import { FormButtons } from './FormButtons'
import { FormControl } from './FormControl'
import { FormError } from './FormError'
import { FormSection } from './FormSection'

type OwnProps = {
  header: string
  children: React.ReactElement<typeof FormSection> | React.ReactElement<typeof FormSection>[]
}

export type FormRootProps<Tag extends AnyTag> = Polymorphic<OwnProps, Tag>

function FormRoot<Tag extends AnyTag = 'form'>({ header, children, as, ...rest }: FormRootProps<Tag>) {
  return React.createElement(
    as || 'form',
    { className: 'gap-x-10 divide-y divide-slate-800', ...rest },
    <>
      <Typography variant="h3" className="text-slate-50 py-6">
        {header}
      </Typography>
      <div className="divide-y divide-slate-800">{children}</div>
    </>
  )
}

export const Form: typeof FormRoot & {
  Buttons: typeof FormButtons
  Control: typeof FormControl
  Section: typeof FormSection
  Error: typeof FormError
} = Object.assign(FormRoot, {
  Buttons: FormButtons,
  Control: FormControl,
  Section: FormSection,
  Error: FormError,
})
