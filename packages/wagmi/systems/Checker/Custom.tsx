import { ButtonProps } from '@sushiswap/ui'
import React, { cloneElement, FC, ReactElement, ReactNode } from 'react'

export interface CustomProps {
  showGuardIfTrue: boolean
  guard: ReactElement<ButtonProps<'button'>>
  children: ReactNode
}

export const Custom: FC<CustomProps> = ({ showGuardIfTrue, guard, children }) => {
  if (showGuardIfTrue) {
    return <>{cloneElement(guard, { ...guard.props, disabled: true }, guard.props.children)}</>
  }

  return <>{children}</>
}
