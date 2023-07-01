import React, { FC } from 'react'

export interface FormSectionHeaderProps {
  header: string
  subheader?: string
}

const FormSectionHeader: FC<FormSectionHeaderProps> = ({ header, subheader }) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-lg text-high-emphesis">{header}</p>
        {subheader && <p className="text-sm">{subheader}</p>}
      </div>
    </div>
  )
}

export default FormSectionHeader
