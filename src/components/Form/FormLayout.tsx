import { classNames } from 'app/functions'
import { FC } from 'react'

export interface FormFieldsProps {
  className?: string
}

const FormFields: FC<FormFieldsProps> = ({ children, className }) => {
  return <div className={classNames('space-y-8', className)}>{children}</div>
}

export default FormFields
