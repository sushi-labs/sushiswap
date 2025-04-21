import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'

type CheckerRoleData = {
  requiredRole: (typeof roles)[number]
  actualRole: (typeof roles)[number]
  message: string
  loading?: false
  disabled?: boolean
  children(disabled: boolean): React.ReactNode
}

type CheckerRoleLoading = {
  loading: true
  disabled?: boolean
  children(disabled: boolean): React.ReactNode
}

type CheckerRole = CheckerRoleData | CheckerRoleLoading

export const roles = ['owner', 'admin', 'viewer']

export function CheckerRole({
  children,
  disabled: alreadyDisabled,
  ...props
}: CheckerRole) {
  const disabled =
    props.loading ||
    alreadyDisabled ||
    roles.indexOf(props.actualRole) > roles.indexOf(props.requiredRole)

  if (!disabled) {
    return <span>{children(false)}</span>
  }

  if (alreadyDisabled || props.loading) {
    return <span>{children(true)}</span>
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span>{children(true)}</span>
        </TooltipTrigger>
        <TooltipContent align="end" className="!bg-background !p-4">
          {props.message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
