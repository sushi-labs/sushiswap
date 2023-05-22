import React, { ElementType, forwardRef, ReactElement, ReactNode, useEffect, useState } from 'react'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types'
import classNames from 'classnames'

interface Props {
  dep: string | undefined
  timeout?: number
  className?: string
  children: ReactNode | ((isBlinking: boolean) => ReactNode)
}

export type BlinkProps<C extends ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type BlinkComponent = <C extends ElementType = 'div'>(props: BlinkProps<C>) => ReactElement | null

export const Blink: BlinkComponent = forwardRef(
  <Tag extends ElementType = 'div'>(
    { as, dep, children, timeout = 300, className = '', ...rest }: BlinkProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'button'
    const [{ className: _className, isBlinking }, _setClassName] = useState<{ className: string; isBlinking: boolean }>(
      {
        className,
        isBlinking: false,
      }
    )

    useEffect(() => {
      _setClassName((prev) => ({
        className: classNames(prev, 'animate-blink'),
        isBlinking: true,
      }))

      setTimeout(() => {
        _setClassName((prev) => ({
          className: prev.className
            .split(' ')
            .filter((el) => el !== 'animate-blink')
            .join(' '),
          isBlinking: false,
        }))
      }, timeout)
    }, [dep, timeout])

    return (
      <Component {...rest} ref={ref} className={_className}>
        {typeof children === 'function' ? children(isBlinking) : children}
      </Component>
    )
  }
)
