import React, { FC } from 'react'

interface FormButtons {
  children: React.ReactNode | React.ReactNode[]
}

export const FormButtons: FC<FormButtons> = ({ children }) => {
  return <div className="pt-4 flex gap-4 justify-end">{children}</div>
}
