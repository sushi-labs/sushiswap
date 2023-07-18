import { classNames } from '@sushiswap/ui'
import { FC, ReactElement } from 'react'

import { FormSectionProps } from './FormSection'

export interface FormCardProps {
  children: ReactElement<FormSectionProps> | ReactElement<FormSectionProps>[]
  className?: string
}

const FormCard: FC<FormCardProps> = ({ children, className }) => {
  return <div className={classNames('bg-slate-800 p-6 rounded-xl space-y-8 divide-y', className)}>{children}</div>
}

export default FormCard
