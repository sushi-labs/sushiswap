import React, { FC, ReactElement } from 'react'
import { FormProvider } from 'react-hook-form'
import { UseFormReturn } from 'react-hook-form/dist/types'

import FormCard, { FormCardProps } from './FormCard'
import FormFieldHelperText, { FormFieldHelperTextProps } from './FormFieldHelperText'
import FormSection, { FormSectionProps } from './FormSection'
import FormSelectField, { FormSelectFieldProps } from './FormSelectField'
import FormSubmit, { FormSubmitProps } from './FormSubmit'
import FormTextAreaField, { FormTextAreaFieldProps } from './FormTextAreaField'
import FormTextField, { FormTextFieldProps } from './FormTextField'

export const DEFAULT_FORM_FIELD_CLASSNAMES =
  'appearance-none outline-none rounded-xl placeholder:text-slate-600 bg-slate-700 px-3 py-2 focus:ring-purple focus:border-purple block w-full min-w-0 border border-slate-900'

export interface FormProps extends UseFormReturn<any> {
  onSubmit(x: any): void
  children: ReactElement<FormCardProps>
}

type Form<P> = FC<P> & {
  Card: FC<FormCardProps>
  Section: FormSection<FormSectionProps>
  Submit: FC<FormSubmitProps>
  TextField: FC<FormTextFieldProps>
  SelectField: FC<FormSelectFieldProps>
  TextAreaField: FC<FormTextAreaFieldProps>
  HelperText: FC<FormFieldHelperTextProps>
}

export const Form: Form<FormProps> = ({ children, onSubmit, ...rest }) => {
  return (
    <FormProvider {...rest}>
      <form onSubmit={rest.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}

Form.Card = FormCard
Form.Section = FormSection
Form.Submit = FormSubmit
Form.TextField = FormTextField
Form.SelectField = FormSelectField
Form.TextAreaField = FormTextAreaField
Form.HelperText = FormFieldHelperText
