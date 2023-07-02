import { classNames } from '@sushiswap/ui'
import React, { FC } from 'react'

export interface FormFieldHelperTextProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
}

const FormFieldHelperText: FC<FormFieldHelperTextProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={classNames('text-sm text-gray-600 mt-2', className)}>
      <div {...props}>{children}</div>
    </div>
  )
}

export default FormFieldHelperText
