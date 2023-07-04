import { classNames } from '@sushiswap/ui'
import React, { FC, ReactElement, ReactNode, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { FormType } from '../../../page'
import { DEFAULT_FORM_FIELD_CLASSNAMES } from '..'
import FormFieldHelperText from '../FormFieldHelperText'

export interface FormTextFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: keyof FormType
  error?: string
  helperText?: ReactNode
  icon?: ReactNode
  endIcon?: ReactNode
  children?: ReactElement<HTMLInputElement>
}

const FormTextField: FC<FormTextFieldProps> = ({ name, label, helperText, icon, endIcon, error, ...rest }) => {
  const {
    register,
    unregister,
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
      {label && <p className="font-semibold">{label}</p>}
      <div
        className={classNames(
          'mt-2 flex rounded-xl shadow-xl border',
          errors[name]
            ? 'border-red/40 hover:border-red focus:border-red active:focus:border-red'
            : 'border-transparent'
        )}
      >
        {icon && (
          <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md border-dark-800 sm:text-sm">
            {icon}
          </span>
        )}
        <input
          {...register(name)}
          {...rest}
          className={classNames(
            icon && !endIcon ? 'rounded-none rounded-r-md' : 'rounded',
            endIcon && !icon ? 'rounded-none rounded-l-md' : 'rounded',
            icon && endIcon ? 'rounded-none' : 'rounded',
            DEFAULT_FORM_FIELD_CLASSNAMES,
            errors[name] ? '!border-transparent' : '',
            rest.className
          )}
          // autoComplete="off"
          // autoCorrect="off"
          // autoCapitalize="off"
        />
        {endIcon && (
          <span className="inline-flex items-center px-3 border border-l-0 rounded-r-md border-dark-800 sm:text-sm">
            {endIcon}
          </span>
        )}
      </div>
      {errors[name] ? (
        <FormFieldHelperText className="!text-red">{errors[name]?.message}</FormFieldHelperText>
      ) : error ? (
        <FormFieldHelperText className="!text-red">{error}</FormFieldHelperText>
      ) : typeof helperText === 'string' ? (
        <FormFieldHelperText>{helperText}</FormFieldHelperText>
      ) : (
        helperText
      )}
    </>
  )
}

export default FormTextField
