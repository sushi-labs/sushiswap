import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC } from 'react'

interface CustomProps extends ButtonProps {
  showChildren?: boolean
  onClick(): void
  buttonText: string
}

const Custom: FC<CustomProps> = ({
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

export { Custom, type CustomProps }
