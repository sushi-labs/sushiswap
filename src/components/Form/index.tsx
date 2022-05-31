import FormCard, { FormCardProps } from 'app/components/Form/FormCard'
import FormFieldHelperText, { FormFieldHelperTextProps } from 'app/components/Form/FormFieldHelperText'
import { FormFieldsProps } from 'app/components/Form/FormLayout'
import FormFields from 'app/components/Form/FormLayout'
import FormSection, { FormSectionProps } from 'app/components/Form/FormSection'
import FormSelectField, { FormSelectFieldProps } from 'app/components/Form/FormSelectField'
import FormSubmit, { FormSubmitProps } from 'app/components/Form/FormSubmit'
import FormTextAreaField, { FormTextAreaFieldProps } from 'app/components/Form/FormTextAreaField'
import FormTextField, { FormTextFieldProps } from 'app/components/Form/FormTextField'
import React, { FC } from 'react'
import { FormProvider } from 'react-hook-form'
import { UseFormReturn } from 'react-hook-form/dist/types'

export const DEFAULT_FORM_FIELD_CLASSNAMES =
  'appearance-none outline-none rounded placeholder:text-low-emphesis bg-dark-1000/40 px-3 py-2 focus:ring-purple focus:border-purple block w-full min-w-0 border border-dark-800'

export interface FormProps extends UseFormReturn<any> {
  // @ts-ignore TYPE NEEDS FIXING
  onSubmit(x): void
}

type Form<P> = FC<P> & {
  Card: FC<FormCardProps>
  Fields: FC<FormFieldsProps>
  Section: FormSection<FormSectionProps>
  Submit: FC<FormSubmitProps>
  TextField: FC<FormTextFieldProps>
  SelectField: FC<FormSelectFieldProps>
  TextAreaField: FC<FormTextAreaFieldProps>
  HelperText: FC<FormFieldHelperTextProps>
}

const Form: Form<FormProps> = ({ children, onSubmit, ...rest }) => {
  return (
    <FormProvider {...rest}>
      <form onSubmit={rest.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  )
}

Form.Card = FormCard
Form.Fields = FormFields
Form.Section = FormSection
Form.Submit = FormSubmit
Form.TextField = FormTextField
Form.SelectField = FormSelectField
Form.TextAreaField = FormTextAreaField
Form.HelperText = FormFieldHelperText

export default Form
