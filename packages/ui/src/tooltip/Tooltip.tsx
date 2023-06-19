import { default as RcTooltip } from 'rc-tooltip'
import { TooltipProps } from 'rc-tooltip/lib/Tooltip'
import { FC, ReactElement } from 'react'

interface ExtendTooltipProps extends Omit<TooltipProps, 'overlay' | 'arrowContent'> {
  button: ReactElement
  panel: ReactElement
  naked?: boolean
}

/**
 * @deprecated
 */
export const Tooltip: FC<ExtendTooltipProps> = ({
  button,
  panel,
  placement = 'top',
  mouseEnterDelay = 0,
  naked,
  ...props
}) => {
  const offset = [0, 0]
  if (placement?.includes('left')) {
    offset[0] -= 12
  }

  if (placement?.includes('top')) {
    offset[1] -= 12
  }

  if (placement?.includes('bottom')) {
    offset[1] += 12
  }

  if (placement?.includes('right')) {
    offset[0] += 12
  }

  return (
    <RcTooltip
      {...(naked && { overlayInnerStyle: { padding: 0 } })}
      transitionName="rc-tooltip-zoom"
      mouseEnterDelay={mouseEnterDelay}
      align={{ offset }}
      arrowContent={<div className="rc-tooltip-arrow-inner" />}
      overlay={panel}
      placement={placement}
      {...props}
    >
      {button}
    </RcTooltip>
  )
}
