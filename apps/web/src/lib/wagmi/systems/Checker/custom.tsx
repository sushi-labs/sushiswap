import { Button, type ButtonProps } from '@sushiswap/ui'

interface CustomProps extends ButtonProps {
  showChildren?: boolean
  onClick(): void
  buttonText: string
}

function Custom({
  showChildren,
  buttonText,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}: CustomProps) {
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
