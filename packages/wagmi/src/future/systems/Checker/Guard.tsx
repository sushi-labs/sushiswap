import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import React, { FC } from 'react'

export interface GuardProps extends ButtonProps {
  guardWhen: boolean
  guardText: string
}

export const Guard: FC<GuardProps> = ({ guardWhen, guardText, children, fullWidth = true, size = 'xl', ...props }) => {
  if (guardWhen) {
    return (
      <Button size={size} fullWidth={fullWidth} disabled {...props}>
        {guardText}
      </Button>
    )
  }

  return <>{children}</>
}
