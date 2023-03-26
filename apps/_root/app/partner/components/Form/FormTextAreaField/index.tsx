import { classNames, Typography } from '@sushiswap/ui'
import { FormType } from '../../../page'
import React, { FC, ReactElement, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { DEFAULT_FORM_FIELD_CLASSNAMES } from '..'
import FormFieldHelperText from '../FormFieldHelperText'

export interface FormTextAreaFieldProps extends React.HTMLProps<HTMLTextAreaElement> {
  name: keyof FormType
  error?: string
  helperText?: string
  children?: ReactElement<HTMLInputElement>
}

const FormTextAreaField: FC<FormTextAreaFieldProps> = ({ name, label, children, helperText, error, ...rest }) => {
  const {
    unregister,
    register,
    formState: { errors },
  } = useFormContext<FormType>()

  // Unregister on unmount
  useEffect(() => {
    return () => {
      unregister(name)
    }
  }, [name, unregister])

  return (
    <>
      <Typography weight={600}>{label}</Typography>
      <div className="flex mt-2 rounded-lg shadow-lg">
        <textarea
          {...register(name)}
          {...rest}
          className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, errors[name] ? '!border-red' : '')}
        />
      </div>
      {errors[name] ? (
        <FormFieldHelperText className="!text-red">{errors[name]?.message}</FormFieldHelperText>
      ) : (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      )}
    </>
  )
}

export default FormTextAreaField
