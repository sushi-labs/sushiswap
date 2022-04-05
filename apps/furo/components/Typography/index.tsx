import { classNames } from 'app/functions'
import React, { FC, forwardRef } from 'react'

export type TypographyWeight = 400 | 500 | 700

const WEIGHTS = {
  400: 'font-medium',
  700: 'font-bold',
}

export type TypographyVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'lg' | 'base' | 'sm' | 'xs' | 'xxs'

const VARIANTS = {
  hero: 'text-hero leading-[4rem]',
  h1: 'text-4xl leading-[28px]',
  h2: 'text-3xl tracking-[-0.02em]',
  h3: 'text-2xl leading-7 tracking-[-0.01em]',
  lg: 'text-lg leading-6',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-4',
  xxs: 'text-[0.625rem] leading-[1.2]',
}

export interface TypographyProps extends React.AllHTMLAttributes<React.ReactHTML> {
  variant?: TypographyVariant
  weight?: TypographyWeight
  component?: keyof React.ReactHTML
  className?: string
  clickable?: boolean
}

const Typography: FC<TypographyProps> = forwardRef(
  (
    {
      variant = 'base',
      weight = 400,
      component = 'div',
      className = 'currentColor',
      clickable = false,
      children = [],
      onClick = undefined,
      ...rest
    },
    ref
  ) => {
    return React.createElement(
      component,
      {
        className: classNames(
          VARIANTS[variant],
          // @ts-ignore TYPE NEEDS FIXING
          WEIGHTS[weight],
          onClick ? 'cursor-pointer select-none' : '',
          className
        ),
        onClick,
        ...rest,
        ref,
      },
      children
    )
  }
)

export default Typography
