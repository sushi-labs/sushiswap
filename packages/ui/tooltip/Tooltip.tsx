import { default as RcTooltip } from 'rc-tooltip'
import { FC, ReactElement } from 'react'

interface TooltipProps {
  button: ReactElement
  panel: ReactElement
  placement:
    | 'left'
    | 'top'
    | 'bottom'
    | 'right'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
}

export const Tooltip: FC<TooltipProps> = ({ button, panel, placement }) => {
  const offset = [0, 0]
  if (placement.includes('left')) {
    offset[0] -= 12
  }

  if (placement.includes('top')) {
    offset[1] -= 12
  }

  if (placement.includes('bottom')) {
    offset[1] += 12
  }

  if (placement.includes('right')) {
    offset[0] += 12
  }

  return (
    <RcTooltip
      align={{ offset }}
      arrowContent={<div className="rc-tooltip-arrow-inner" />}
      overlay={panel}
      placement={placement}
    >
      {button}
    </RcTooltip>
  )
}
