import { classNames } from '@sushiswap/ui'
import React, { FC, ReactElement, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormType } from '../../../page'
import { DEFAULT_FORM_FIELD_CLASSNAMES } from '..'
import FormFieldHelperText from '../FormFieldHelperText'

export interface FormSelectFieldProps extends React.HTMLProps<HTMLSelectElement> {
  name: keyof FormType
  error?: string
  helperText?: string
  children?: ReactElement<HTMLInputElement>
  options: { value: string; label: string }[]
}

const FormSelectField: FC<FormSelectFieldProps> = ({ name, label, children, helperText, error, options, ...rest }) => {
  const {
    register,
    unregister,
    formState: { errors },
  } = useFormContext<FormType>()

  // Unregister on unmount
  useEffect(() => {
    return () => {
      // @ts-ignore
      unregister(name)
    }
  }, [name, unregister])

  return (
    <>
      <p className="font-semibold">{label}</p>
      <div className="flex mt-2 rounded-md shadow-sm">
        <select
          {...register(name)}
          {...rest}
          className={classNames(DEFAULT_FORM_FIELD_CLASSNAMES, errors[name] ? '!border-red' : '')}
        >
          {options.map(({ value, label }) => (
            <option value={label} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {errors[name] ? (
        <FormFieldHelperText className="!text-red">{errors[name]?.message}</FormFieldHelperText>
      ) : (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      )}
    </>
  )
}

export default FormSelectField
