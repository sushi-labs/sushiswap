import { FC } from 'react'

import classNames from 'classnames'

interface FormHelperText {
  message?: string
  isError?: boolean
}

export const FormHelperText: FC<FormHelperText> = ({ message, isError = false }) => {
  if (!message) return null

  return (
    <span role="alert" className={classNames(isError ? 'text-red' : 'text-slate-500', 'text-sm px-2')}>
      {message}
    </span>
  )
}
