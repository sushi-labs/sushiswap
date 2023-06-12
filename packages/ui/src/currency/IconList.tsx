import classNames from 'classnames'
import { Children, cloneElement, FC, isValidElement, ReactNode } from 'react'

export interface IconListProps {
  children: ReactNode
  iconWidth: number
  iconHeight: number
}

export const IconList: FC<IconListProps> = ({ children, iconWidth, iconHeight }) => {
  return (
    <div className="flex items-center">
      <div className={classNames('inline-flex space-x-[-17.5%]')}>
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return (
              <div className="rounded-full inline-flex dark:shadow-sm dark:shadow-black dark:ring-1 dark:ring-black/10 z-10">
                {cloneElement(child, {
                  ...child.props,
                  width: iconWidth || child.props.width,
                  height: iconHeight || child.props.height,
                  minWidth: iconWidth || child.props.minWidth,
                  minHeight: iconHeight || child.props.height,
                })}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
