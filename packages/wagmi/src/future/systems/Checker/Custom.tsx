import React, { FC} from 'react'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'

export interface CustomProps extends ButtonProps {
  guardWhen: boolean
  guardText: string
}

export const Custom: FC<CustomProps> = ({ guardWhen, guardText, children, fullWidth = true, size = 'xl',  ...props }) => {
  if (guardWhen) {
    return <Button size={size} fullWidth={fullWidth} disabled {...props}>{guardText}</Button>
  }

  return <>{children}</>
}
