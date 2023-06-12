import React from 'react'

import { PolymorphicComponentProps } from '../types'
import { Typography } from '../typography'
import { FormButtons } from './FormButtons'
import { FormControl } from './FormControl'
import { FormError } from './FormError'
import { FormHelperText } from './FormHelperText'
import { FormSection } from './FormSection'

type Props = {
  header: string
  children: React.ReactElement<typeof FormSection> | React.ReactElement<typeof FormSection>[]
}

type FormRootProps<C extends React.ElementType> = PolymorphicComponentProps<C, Props>
type FormRootComponent = <C extends React.ElementType = 'form'>(props: FormRootProps<C>) => React.ReactElement | null

const FormRoot: FormRootComponent = ({ header, children, as, ...rest }) => {
  const Component = as || 'form'

  return (
    <Component className="gap-x-10 divide-y divide-slate-800" {...rest}>
      <>
        <Typography variant="h3" className="text-slate-50 py-6">
          {header}
        </Typography>
        <div className="divide-y divide-slate-800">{children}</div>
      </>
    </Component>
  )
}

/**
 * @deprecated
 */
export const Form: typeof FormRoot & {
  Buttons: typeof FormButtons
  Control: typeof FormControl
  Section: typeof FormSection
  Error: typeof FormError
  HelperText: typeof FormHelperText
} = Object.assign(FormRoot, {
  Buttons: FormButtons,
  Control: FormControl,
  Section: FormSection,
  Error: FormError,
  HelperText: FormHelperText,
})
