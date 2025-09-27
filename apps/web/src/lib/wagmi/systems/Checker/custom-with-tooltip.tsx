import { InformationCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  type ButtonProps,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { FC } from 'react'

interface CustomWithTooltipProps extends ButtonProps {
  showChildren?: boolean
  onClick(): void
  buttonText: string
  tooltipTitle: string
  tooltipDescription: string
}

const CustomWithTooltip: FC<CustomWithTooltipProps> = ({
  showChildren,
  buttonText,
  tooltipTitle,
  tooltipDescription,
  children,
  fullWidth = true,
  size = 'xl',
  disabled,
  className,
  ...props
}) => {
  if (showChildren) {
    return <>{children}</>
  }

  if (disabled) {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <div className="w-full">
            <Button
              size={size}
              fullWidth={fullWidth}
              disabled={disabled}
              className={className}
              {...props}
            >
              {buttonText}
            </Button>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="!p-0 max-w-[320px]">
          <CardHeader>
            <CardTitle>{tooltipTitle}</CardTitle>
            <CardDescription>{tooltipDescription}</CardDescription>
          </CardHeader>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        className={classNames(className, 'group relative')}
        {...props}
      >
        {buttonText}
        <HoverCardTrigger>
          <InformationCircleIcon width={16} height={16} />
        </HoverCardTrigger>
      </Button>
      <HoverCardContent className="!p-0 max-w-[320px]">
        <CardHeader>
          <CardTitle>{tooltipTitle}</CardTitle>
          <CardDescription>{tooltipDescription}</CardDescription>
        </CardHeader>
      </HoverCardContent>
    </HoverCard>
  )
}

export { CustomWithTooltip, type CustomWithTooltipProps }
