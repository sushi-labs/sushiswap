import classNames from 'classnames'
import type { FC } from 'react'

import type { IconProps } from '../types'

interface CircleWithText extends IconProps {
  text?: string | number
}

export const CircleIcon: FC<CircleWithText> = ({
  text,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="transparent"
      stroke="currentColor"
      fontSize="1.5rem"
      strokeWidth="2"
      className={classNames('shrink-0 block rounded-full', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9.6" />
      {typeof text !== 'undefined' && (
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="0.75rem"
          stroke="var(--primary)"
          fontFamily="inherit"
        >
          {text}
        </text>
      )}
    </svg>
  )
}
