import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { Loader } from '../loader'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'purple' | 'gradient' | 'gray'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'default'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

const VARIANT: Record<ButtonVariant, string> = {
  filled: 'btn-filled',
  outlined: 'btn-outlined',
  empty: 'btn-empty',
}

const COLOR: Record<ButtonColor, string> = {
  blue: 'btn-blue',
  red: 'btn-red',
  pink: 'btn-pink',
  purple: 'btn-purple',
  gradient: 'btn-gradient',
  gray: 'btn-gray',
}

const SIZE: Record<ButtonSize, string> = {
  default: 'btn-default',
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

interface Props {
  children?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
  href?: string
}

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
type ButtonComponent = <C extends React.ElementType = 'button'>(props: ButtonProps<C>) => React.ReactElement | null

export const Button: ButtonComponent = React.forwardRef(
  <Tag extends React.ElementType = 'button'>(
    {
      as,
      children,
      className,
      color = 'blue',
      size = 'default',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      ...rest
    }: ButtonProps<Tag>,
    ref?: PolymorphicRef<Tag>
  ) => {
    const Component = as || 'button'

    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={classNames(
          'btn',
          fullWidth ? 'w-full' : '',
          VARIANT[variant],
          COLOR[color],
          SIZE[size],
          className,
          disabled ? 'btn-disabled' : ''
        )}
        {...rest}
      >
        {loading ? (
          <Loader stroke="currentColor" />
        ) : (
          <>
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
          </>
        )}
      </Component>
    )
  }
)

export default Button
