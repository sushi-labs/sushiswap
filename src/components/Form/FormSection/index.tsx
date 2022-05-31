import React, { FC, ReactElement } from 'react'

import FormSectionHeader, { FormSectionHeaderProps } from './FormSectionHeader'

export interface FormSectionProps {
  header: ReactElement<FormSectionHeaderProps>
  columns?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  className?: string
}

type FormSection<P> = FC<P> & {
  Header: FC<FormSectionHeaderProps>
}

const FormSection: FormSection<FormSectionProps> = ({ children, className, columns = 3, header }) => {
  return (
    <div className={className}>
      {header}
      <div className={`mt-6 grid grid-cols-${columns} gap-y-8 gap-x-4`}>{children}</div>
    </div>
  )
}

FormSection.Header = FormSectionHeader
export default FormSection
