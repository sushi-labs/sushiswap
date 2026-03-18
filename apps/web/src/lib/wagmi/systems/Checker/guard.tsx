import { Button, type ButtonProps } from '@sushiswap/ui'

interface GuardProps extends ButtonProps {
  guardWhen: boolean
  guardText: string
}

function Guard({
  guardWhen,
  guardText,
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}: GuardProps) {
  if (guardWhen) {
    return (
      <Button size={size} fullWidth={fullWidth} disabled {...props}>
        {guardText}
      </Button>
    )
  }

  return <>{children}</>
}

export { Guard, type GuardProps }
