'use client'

import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface CheckIconProps {
  className?: string
}

export const CheckIcon: FC<CheckIconProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'flex h-6 w-6 items-center justify-center rounded-full bg-[#1AC87F]',
        className,
      )}
    >
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M1 5L5 9L13 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
