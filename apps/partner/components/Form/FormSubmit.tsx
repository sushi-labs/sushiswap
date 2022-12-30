import React, { FC } from 'react'

export interface FormSubmitProps {
  children?: React.ReactNode
}

export const FormSubmit: FC<FormSubmitProps> = ({ children }) => {
  return (
    <div className="pt-8">
      <div className="flex justify-end">{children}</div>
    </div>
  )
}

export default FormSubmit
