import classNames from 'classnames'
import React, { forwardRef, ReactNode } from 'react'

import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'

const WEIGHTS: Record<string, string> = {
  100: 'font-thin',
  200: 'font-extralight',
  300: 'font-light',
  400: 'font-normal',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
  800: 'font-extrabold',
  900: 'font-black',
}

const VARIANTS: Record<string, string> = {
  hero: 'text-5xl ',
  h1: 'text-4xl',
  h2: 'text-3xl ',
  h3: 'text-2xl ',
  xl: 'text-xl  ',
  lg: 'text-lg ',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-5',
  xxs: 'text-[0.625rem] leading-[1.2]',
}

export type TypographyWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type TypographySelect = 'none' | 'text' | 'all' | 'auto'
export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'xl' | 'lg' | 'base' | 'sm' | 'xs' | 'xxs'

type Props = {
  children: ReactNode | ReactNode[]
  variant?: TypographyVariant
  weight?: TypographyWeight
  className?: string
  select?: TypographySelect
}

type TypographyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
type TypographyComponent = <C extends React.ElementType = 'div'>(props: TypographyProps<C>) => React.ReactElement | null

/**
 * @deprecated
 */
export const Typography: TypographyComponent = forwardRef(
  <Tag extends React.ElementType = 'div'>(
    { as, variant = 'base', weight = 400, className, children, onClick, select, ...rest }: TypographyProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'div'

    return (
      <Component
        className={classNames(
          VARIANTS[variant],
          WEIGHTS[weight],
          select,
          onClick ? 'cursor-pointer select-none' : '',
          className
        )}
        onClick={onClick}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)
