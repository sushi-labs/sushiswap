import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface FormFieldHelperTextProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

const FormFieldHelperText: FC<FormFieldHelperTextProps> = ({ children, className = '', ...props }) => {
  return (
    <Typography variant="sm" className={classNames('text-gray-600 mt-2', className)}>
      <div {...props}>{children}</div>
    </Typography>
  )
}

export default FormFieldHelperText
