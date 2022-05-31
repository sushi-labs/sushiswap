import React, { FC } from 'react'

import { classNames } from '../../functions'

export const Column: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={classNames('flex flex-col justify-center', className)} {...rest}>
    {children}
  </div>
)

export const ColumnCenter: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <Column className="items-center w-full" {...rest}>
    {children}
  </Column>
)

interface AutoColumnProps {
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}

export const AutoColumn: FC<React.HTMLAttributes<HTMLDivElement> & AutoColumnProps> = ({
  children,
  className,
  gap,
  justify,
  style,
  ...rest
}) => (
  <div
    className={classNames('grid', className)}
    style={{
      gridRowGap: (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap,
      justifyItems: justify && justify,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
)

export default Column
