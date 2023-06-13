import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { FC, ReactNode } from 'react'

const SIZE = {
  default: 'h-[24px]',
  sm: 'h-5 !text-[10px]',
  lg: 'h-12 text-[14px]',
}

const FILLED = {
  default: 'bg-gray-700 text-white',
  white: 'bg-high-emphesis text-slate-700',
  purple: 'bg-purple-500 bg-opacity-20 text-purple',
  yellow: 'bg-yellow-500 bg-opacity-20 text-yellow',
  blue: 'bg-blue-500 bg-opacity-20 text-blue',
  green: 'bg-green-500 bg-opacity-20 text-green',
  pink: 'bg-pink-500 bg-opacity-20 text-pink',
  red: 'bg-red-500 bg-opacity-20 text-red',
  gray: 'bg-white bg-opacity-10 text-slate-300',
}

const VARIANT = {
  filled: FILLED,
}

export type ChipColor = 'default' | 'purple' | 'yellow' | 'blue' | 'green' | 'white' | 'pink' | 'red' | 'gray'
export type ChipSize = 'default' | 'sm'
export type ChipVariant = 'filled'

export interface ChipProps {
  label: ReactNode
  color?: ChipColor
  variant?: ChipVariant
  size?: ChipSize
  opaque?: boolean
  className?: string
  // @ts-ignore TYPE NEEDS FIXING
  onClick?: (e) => void
  icon?: ReactNode
  endIcon?: ReactNode
  id?: string
}

/**
 * @deprecated
 */
export const Chip: FC<ChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'default',
  className = '',
  onClick,
  icon = undefined,
  opaque,
  endIcon = <XMarkIcon width={12} height={12} strokeWidth={5} />,
  id = '',
}) => {
  return (
    <div
      id={id}
      className={classNames(
        VARIANT[variant][color],
        SIZE[size],
        opaque ? '!bg-opacity-100 !text-slate-900 font-bold' : '',
        onClick ? 'pr-1' : 'pr-3',
        'whitespace-nowrap inline-flex rounded-2xl py-0.5 pl-3 font-medium text-xs leading-5 gap-2 items-center justify-center',
        className
      )}
    >
      {icon && (
        <div aria-hidden="true" className="rounded" onClick={onClick}>
          {icon}
        </div>
      )}

      {label}
      {onClick && (
        <div
          aria-hidden="true"
          className="rounded bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.24)] cursor-pointer p-0.5"
          onClick={onClick}
        >
          {endIcon}
        </div>
      )}
    </div>
  )
}
