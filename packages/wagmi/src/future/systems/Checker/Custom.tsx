import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import React, { FC } from 'react'

export interface CustomProps extends ButtonProps {
  showChildren?: boolean
  onClick(): void
  buttonText: string
}

export const Custom: FC<CustomProps> = ({
  showChildren,
  buttonText,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  if (!showChildren) {
    return (
      <Button size={size} fullWidth={fullWidth} {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
