import classNames from 'classnames'
import React, { forwardRef, ReactNode } from 'react'

import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'

export type MaxWidth = 'full' | '7xl' | '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'

const TailwindMapper: Record<MaxWidth, string> = {
  full: 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  xl: 'max-w-xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xs: 'max-w-xs',
}

interface Props {
  children: ReactNode
  maxWidth?: MaxWidth | number
  className?: string
  id?: string
}

type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
type ContainerComponent = <C extends React.ElementType = 'div'>(props: ContainerProps<C>) => React.ReactElement | null

/**
 * @deprecated
 */
export const Container: ContainerComponent = forwardRef(
  <Tag extends React.ElementType = 'div'>(
    { as, children, maxWidth = '2xl', className = '', id, ...rest }: ContainerProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'div'
    return (
      <Component
        ref={ref}
        className={classNames(className, typeof maxWidth === 'number' ? '' : TailwindMapper[maxWidth], 'w-full')}
        id={id}
        {...((typeof maxWidth === 'number' || rest.style) && {
          style: { ...rest.style, maxWidth },
        })}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)

export default Container
