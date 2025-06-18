import classNames from 'classnames'
import {
  Children,
  type ComponentProps,
  type FC,
  type ReactNode,
  cloneElement,
  isValidElement,
} from 'react'
import type { Icon } from './Icon'

export interface IconListProps {
  children: ReactNode
  iconWidth: number
  iconHeight: number
  className?: string
}

export const IconList: FC<IconListProps> = ({
  children,
  iconWidth,
  iconHeight,
  className,
}) => {
  return (
    <div className="flex items-center">
      <div className={classNames('inline-flex')}>
        {Children.map(children, (child, index) => {
          if (isValidElement<ComponentProps<typeof Icon>>(child)) {
            return (
              <div
                className={classNames(
                  'rounded-full inline-flex z-10 border-2 ring-gray-50 dark:ring-slate-950',
                  className,
                )}
                style={{ marginLeft: index > 0 ? -iconWidth / 3 : 0 }}
              >
                {cloneElement(child, {
                  ...child.props,
                  width: iconWidth || child.props.width,
                  height: iconHeight || child.props.height,
                })}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
