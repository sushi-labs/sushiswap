import classNames from 'classnames'
import React, { forwardRef, ReactNode } from 'react'

import { AnyTag, Polymorphic } from '../types'

const WEIGHTS: Record<string, string> = {
  400: 'font-normal',
  500: 'font-medium',
  700: 'font-bold',
  900: 'font-black',
}

const VARIANTS: Record<string, string> = {
  hero: 'text-5xl leading-[4rem]',
  h1: 'text-4xl leading-[28px]',
  h2: 'text-3xl tracking-[-0.02em]',
  h3: 'text-2xl leading-7 tracking-[-0.01em]',
  xl: 'text-xl leading-7 tracking-[-0.01em]',
  lg: 'text-lg leading-6',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-4',
  xxs: 'text-[0.625rem] leading-[1.2]',
}

export type TypographyWeight = 400 | 500 | 700 | 900
export type TypographySelect = 'none' | 'text' | 'all' | 'auto'
export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'xl' | 'lg' | 'base' | 'sm' | 'xs' | 'xxs'

type OwnProps = {
  children: ReactNode | ReactNode[]
  variant?: TypographyVariant
  weight?: TypographyWeight
  className?: string
  select?: TypographySelect
}

export type TypographyProps<Tag extends AnyTag> = Polymorphic<OwnProps, Tag>

declare function TypographyFn<Tag extends AnyTag = 'div'>(props: TypographyProps<Tag>): JSX.Element

export const Typography = forwardRef<HTMLElement, TypographyProps<any>>(
  (
    {
      variant = 'base',
      weight = 400,
      as = 'div',
      className = 'text-slate-400',
      children = [],
      onClick = undefined,
      select = 'auto',
      ...rest
    },
    ref,
  ) => {
    return React.createElement(
      as,
      {
        className: classNames(
          VARIANTS[variant],
          WEIGHTS[weight],
          select,
          onClick ? 'cursor-pointer select-none' : '',
          className,
        ),
        onClick,
        ...rest,
        ref,
      },
      children,
    )
  },
) as typeof TypographyFn
