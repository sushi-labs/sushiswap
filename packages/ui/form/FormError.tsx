import { FC } from 'react'

import { Typography } from '../typography'

interface FormError {
  message?: string
}

export const FormError: FC<FormError> = ({ message }) => {
  if (!message) return null

  return (
    <Typography variant="xs" className="text-red">
      {message}
    </Typography>
  )
}
