import React, { Children, cloneElement, FC, ReactElement } from 'react'

import { classNames } from '../../functions'

interface RowProps {
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}

export const Row: FC<React.HTMLAttributes<HTMLDivElement> & RowProps> = ({
  children,
  className,
  width,
  align,
  justify,
  padding,
  border,
  borderRadius,
  style,
}) => (
  <div
    className={classNames('w-full flex p-0', className)}
    style={{
      width,
      alignItems: align,
      justifyContent: justify,
      padding,
      border,
      borderRadius,
      ...style,
    }}
  >
    {children}
  </div>
)

export const RowBetween: FC<React.HTMLAttributes<HTMLDivElement> & RowProps> = ({ children, ...rest }) => (
  <Row className="justify-between" {...rest}>
    {children}
  </Row>
)

export const RowFlat: FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <div className="flex items-end" {...rest}>
    {children}
  </div>
)

interface AutoRowProps extends RowProps {
  gap?: string
}

export const AutoRow: FC<React.HTMLAttributes<HTMLDivElement> & AutoRowProps> = ({
  children,
  gap,
  justify,
  style,
  ...rest
}) => (
  <Row
    className="flex-wrap"
    style={{
      justifyContent: justify && justify,
      margin: gap && `-${gap}`,
      ...style,
    }}
    {...rest}
  >
    {Children.map(children, (child) => cloneElement(child as ReactElement, { style: { margin: gap } }))}
  </Row>
)

interface RowFixedProps extends RowProps {
  gap?: string
}

export const RowFixed: FC<React.HTMLAttributes<HTMLDivElement> & RowFixedProps> = ({
  children,
  gap,
  style,
  ...rest
}) => (
  <Row
    style={{
      width: 'fit-content',
      margin: gap && `-${gap}`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Row>
)

export default Row
