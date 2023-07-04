'use client'

import React, { ElementType, forwardRef, ReactNode, useEffect, useState } from 'react'

import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'

interface Props {
  dep: string | undefined
  timeout?: number
  className?: string
  children: ReactNode | ((isBlinking: boolean) => ReactNode)
}

export type BlinkProps<C extends ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type BlinkComponent = <C extends ElementType = 'div'>(props: BlinkProps<C>) => ReactNode | null

export const Blink: BlinkComponent = forwardRef(function Blink<Tag extends ElementType = 'div'>(
  { as, dep, children, timeout = 300, className = '', ...rest }: BlinkProps<Tag>,
  ref?: PolymorphicRef<Tag>
) {
  const Component = as || 'button'
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    setBlinking(true)

    setTimeout(() => {
      setBlinking(false)
    }, timeout)
  }, [dep, timeout])

  return (
    <Component {...rest} ref={ref} className={className}>
      {typeof children === 'function' ? children(blinking) : children}
    </Component>
  )
})
