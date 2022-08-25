import { FC, ReactNode } from 'react'

export interface CustomProps {
  logic: boolean
  button: ReactNode
  children: ReactNode
}

export const Custom: FC<CustomProps> = ({ logic, button, children }) => {
  if (logic) return <>{button}</>

  return <>{children}</>
}
