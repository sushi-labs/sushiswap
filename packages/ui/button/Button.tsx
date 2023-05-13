import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { Loader } from '../loader'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../types'
import { BUTTON_CLASSES, BUTTON_SIZES, BUTTON_STYLES, BUTTON_STYLES_VARIANT } from './styles'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'purple' | 'gradient' | 'gray'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'default'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

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

export type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type ButtonComponent = <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>
) => React.ReactElement | null

/**
 * @deprecated use ui/future/button
 */
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
          BUTTON_CLASSES['btn'],
          BUTTON_CLASSES[BUTTON_STYLES_VARIANT[variant]],
          BUTTON_CLASSES[BUTTON_STYLES[variant][color]],
          BUTTON_CLASSES[BUTTON_SIZES[size]],
          className,
          disabled ? BUTTON_CLASSES['btn-disabled'] : ''
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
