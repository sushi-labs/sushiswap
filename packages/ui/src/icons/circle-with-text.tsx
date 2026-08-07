import classNames from 'classnames'
import React, { type FC } from 'react'

import type { IconProps } from '../types'

interface CircleWithText extends IconProps {
  text?: string | number
}

export const CircleWithText: FC<CircleWithText> = ({
  text,
  className,
  ...props
}) => {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fontSize="1.5rem"
      className={classNames('shrink-0 block rounded-full', className)}
    >
      <circle cx="12" cy="12" r="9.6" />
      {typeof text !== 'undefined' && (
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="0.75rem"
          stroke="#fff"
          fontFamily="inherit"
        >
          {text}
        </text>
      )}
    </svg>
  )
}
