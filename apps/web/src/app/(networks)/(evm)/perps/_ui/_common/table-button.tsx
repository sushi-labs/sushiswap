import { classNames } from '@sushiswap/ui'
import type { ButtonHTMLAttributes, FC } from 'react'

export const TableButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  return (
    <button
      {...props}
      type="button"
      className={classNames(
        'font-medium text-blue hover:text-blue/80 disabled:opacity-50 disabled:cursor-not-allowed',
        props.className ?? '',
      )}
    >
      {props.children}
    </button>
  )
}
