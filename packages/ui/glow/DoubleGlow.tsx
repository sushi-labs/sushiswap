import { FC, ReactNode } from 'react'

export interface DoubleGlow {
  children?: ReactNode | ReactNode[]
}

export const DoubleGlow: FC<DoubleGlow> = ({ children }) => {
  return (
    <div className="relative flex justify-center">
      <div className="absolute right-0 w-[140px] h-[180px] bg-pink/20 blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[140px] h-[180px] bg-blue/20 blur-[100px] pointer-events-none" />
      {children}
    </div>
  )
}
