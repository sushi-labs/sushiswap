import { FC } from 'react'

import { Typography } from '../typography'

interface FormHelperText {
  message?: string
  isError?: boolean
}

export const FormHelperText: FC<FormHelperText> = ({ message, isError = false }) => {
  if (!message) return null

  return (
    <Typography variant="xs" role="alert" className={isError ? 'text-red' : 'text-slate-500'}>
      {message}
    </Typography>
  )
}
