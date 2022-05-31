import { XIcon } from '@heroicons/react/solid'
import { FC, ReactNode } from 'react'

import { classNames } from '../../functions'

const SIZE = {
  default: 'h-[24px]',
  sm: 'h-5 text-[10px]',
  lg: 'h-12 text-[14px]',
}

const FILLED = {
  default: 'bg-gray-700 text-white',
  white: 'bg-high-emphesis text-dark-700',
  purple: 'bg-purple bg-opacity-25 text-purple',
  yellow: 'bg-yellow bg-opacity-[0.35] text-yellow',
  blue: 'bg-blue bg-opacity-[0.35] text-blue',
  green: 'bg-green bg-opacity-25 text-green',
  pink: 'bg-pink bg-opacity-25 text-pink',
  red: 'bg-red bg-opacity-25 text-red',
}

const VARIANT = {
  filled: FILLED,
}

export type ChipColor = 'default' | 'purple' | 'yellow' | 'blue' | 'green' | 'white' | 'pink' | 'red'
export type ChipSize = 'default' | 'sm'
export type ChipVariant = 'filled'

export interface ChipProps {
  label: string
  color?: ChipColor
  variant?: ChipVariant
  size?: ChipSize
  className?: string
  // @ts-ignore TYPE NEEDS FIXING
  onClick?: (e) => void
  icon?: ReactNode
  endIcon?: ReactNode
  id?: string
}

const Chip: FC<ChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'default',
  className = '',
  onClick,
  icon = undefined,
  endIcon = <XIcon width={12} height={12} strokeWidth={5} />,
  id = '',
}) => {
  return (
    <div
      id={id}
      className={classNames(
        VARIANT[variant][color],
        SIZE[size],
        onClick ? 'pr-1' : 'pr-3',
        'whitespace-nowrap inline-flex rounded-[12px] py-0.5 pl-3 font-bold text-xs leading-5 gap-2 items-center justify-center',
        className
      )}
    >
      {icon && (
        <div className="rounded" onClick={onClick}>
          {icon}
        </div>
      )}

      {label}
      {onClick && (
        <div
          className="rounded bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.24)] cursor-pointer p-0.5"
          onClick={onClick}
        >
          {endIcon}
        </div>
      )}
    </div>
  )
}

export default Chip
