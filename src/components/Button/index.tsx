import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

import Dots from '../Dots'
import Loader from '../Loader'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'purple' | 'gradient' | 'gray'
export type ButtonSize = 'xs' | 'sm' | 'lg' | 'default' | 'none'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

const DIMENSIONS = {
  xs: 'px-2 h-[28px] !border',
  sm: 'px-3 h-[36px]',
  md: 'px-4 h-[52px]',
  lg: 'px-6 h-[60px]',
}

const SIZE = {
  xs: 'text-xs rounded-full',
  sm: 'text-sm rounded-full',
  md: 'rounded',
  lg: 'text-lg rounded',
}

const FILLED = {
  default:
    'text-higher-emphesis hover:bg-gradient-to-b hover:from-black/20 focus:to-black/20 focus:bg-gradient-to-b focus:from-black/20 hover:to-black/20 active:bg-gradient-to-b active:from-black/40 active:to-black/40 disabled:pointer-events-none disabled:opacity-40',
  blue: 'bg-blue border-blue',
  red: 'bg-red',
  pink: 'bg-pink',
  purple: 'bg-purple',
  gradient:
    '!bg-gradient-to-r from-blue to-pink-600 hover:from-blue/80 hover:to-pink-600/80 focus:from-blue/80 focus:to-pink-600/80 active:from-blue/70 active:to-pink-600/70 focus:border-blue-700',
  gray: 'bg-dark-700',
}

const OUTLINED = {
  default: 'border-2 disabled:pointer-events-none disabled:opacity-40',
  blue: 'border-none bg-blue/20 hover:bg-blue/40 active:bg-blue/60 text-blue focus:bg-blue/40',
  red: 'border-none bg-red/20 hover:bg-red/40 active:bg-red/60 text-red focus:bg-red/40',
  pink: 'border-none bg-pink/20 hover:bg-pink/40 active:bg-pink/60 text-pink focus:bg-pink/40',
  purple: 'border-none bg-purple/20 hover:bg-purple/40 active:bg-purple/60 text-purple focus:bg-purple/40',
  gradient: 'border-none bg-purple/20 hover:bg-purple/40 active:bg-purple/60 text-purple focus:bg-purple/40',
  gray: 'border-dark-700 hover:bg-dark-700/30 active:bg-dark-700/50 focus:bg-dark-700/30',
}

const EMPTY = {
  default:
    'bg-transparent hover:brightness-[90%] focus:brightness-[90%] active:brightness-[80%] disabled:pointer-events-none disabled:opacity-40',
  blue: 'text-blue',
  red: 'text-red',
  pink: 'text-pink',
  purple: 'text-purple',
  gray: 'text-higher-emphesis',
  gradient:
    '!bg-gradient-to-r from-blue to-pink-600 hover:from-blue/80 hover:to-pink-600/80 focus:from-blue/80 focus:to-pink-600/80 active:from-blue/70 active:to-pink-600/70',
}

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
}

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> & {
  Dotted: FC<DottedButtonProps>
}

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
      size = 'md',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled || loading}
        className={classNames(
          VARIANT[variant]['default'],
          // @ts-ignore TYPE NEEDS FIXING
          VARIANT[variant][color],
          // @ts-ignore TYPE NEEDS FIXING
          SIZE[size],
          // @ts-ignore TYPE NEEDS FIXING
          variant !== 'empty' ? DIMENSIONS[size] : '',
          fullWidth ? 'w-full' : '',
          'font-bold flex items-center justify-center gap-1',
          className
        )}
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
  }
)

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button color="red" size="lg" disabled={disabled} {...rest} />
  } else {
    return <Button color="gradient" disabled={disabled} size="lg" {...rest} />
  }
}

interface DottedButtonProps extends ButtonProps {
  pending: boolean
}

export const ButtonDotted: FC<DottedButtonProps> = ({ pending, children, ...rest }) => {
  const buttonText = pending ? <Dots>{children}</Dots> : children
  return (
    <Button {...rest} {...(pending && { disabled: true })}>
      {buttonText}
    </Button>
  )
}

export default Button
