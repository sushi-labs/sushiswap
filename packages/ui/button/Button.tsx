import React, { ReactNode } from 'react'
import classNames from 'classnames'
import Loader from '../loader/Loader'

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

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      color = 'blue',
      size = 'default',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled || loading}
        className={classNames('btn', fullWidth ? 'w-full' : '', VARIANT[variant], COLOR[color], SIZE[size], className)}
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
      </button>
    )
  },
)

export default Button
