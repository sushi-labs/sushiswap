import classNames from 'classnames'
import {
  Children,
  ComponentProps,
  FC,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react'
import { Icon } from './Icon'

export interface IconListProps {
  children: ReactNode
  iconWidth: number
  iconHeight: number
}

export const IconList: FC<IconListProps> = ({
  children,
  iconWidth,
  iconHeight,
}) => {
  return (
    <div className="flex items-center">
      <div className={classNames('inline-flex')}>
        {Children.map(children, (child, index) => {
          if (isValidElement<ComponentProps<typeof Icon>>(child)) {
            return (
              <div
                className="rounded-full inline-flex z-10 border-2 ring-gray-50 dark:ring-slate-950"
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
