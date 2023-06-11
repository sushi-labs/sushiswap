import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { Loader } from '../Loader'
import { BUTTON_CLASSES, BUTTON_SIZES, BUTTON_STYLES, BUTTON_STYLES_VARIANT } from './styles'
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types'

export type ButtonColor = 'red' | 'blue' | 'default' | 'yellow' | 'green'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

interface Props {
  children?: ReactNode | Array<ReactNode>
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
  href?: string
  testId?: string
}

export type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<C, Props>
export type ButtonComponent = <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>
) => React.ReactElement | null

// eslint-disable-next-line react/display-name
export const Button: ButtonComponent = React.forwardRef(
  <Tag extends React.ElementType = 'button'>(
    {
      id,
      as,
      children,
      className,
      color = 'blue',
      size = 'md',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      testId,
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
          disabled || loading ? BUTTON_CLASSES['btn-disabled'] : ''
        )}
        testdata-id={`${testId || id}-button`}
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
