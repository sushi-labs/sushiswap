import { FC } from 'react'

import { classNames } from '../index'
import { LoaderProps } from './types'

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export const Loader: FC<LoaderProps> = ({ size = '16px', ...rest }) => {
  return (
    <svg
      width={size || rest.width}
      height={size || rest.height}
      className={classNames(rest?.className, 'animate-spin-slow')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}
