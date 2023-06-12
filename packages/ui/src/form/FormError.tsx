import { FC } from 'react'

import { FormHelperText } from './FormHelperText'

interface FormError {
  message?: string
}

export const FormError: FC<FormError> = ({ message }) => {
  if (!message) return null

  return <FormHelperText isError={true} message={message} />
}
