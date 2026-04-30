import { classNames } from '@sushiswap/ui'
import type { ButtonHTMLAttributes, FC } from 'react'

const variants = {
  default: 'text-blue hover:text-blue/80',
  gradient:
    'bg-gradient-to-r from-[#27B0E6] from-4% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text hover:from-[#27B0E6]/80 hover:to-[#FA52A0]/80',
}

export const TableButton: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }
> = (props) => {
  const { variant = 'default', className, ...rest } = props
  return (
    <button
      {...rest}
      type="button"
      className={classNames(
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className ?? '',
      )}
    >
      {props.children}
    </button>
  )
}
