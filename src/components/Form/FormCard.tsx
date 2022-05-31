import { classNames } from 'app/functions'
import { FC, ReactElement } from 'react'

import { FormSectionProps } from './FormSection'

export interface FormCardProps {
  children: ReactElement<FormSectionProps> | ReactElement<FormSectionProps>[]
  className?: string
}

const FormCard: FC<FormCardProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'bg-dark-900 p-10 rounded space-y-8 divide-y divide-dark-700 shadow-xl shadow-red/5',
        className
      )}
    >
      {children}
    </div>
  )
}

export default FormCard
