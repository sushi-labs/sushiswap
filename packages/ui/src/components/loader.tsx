'use client'

import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import type React from 'react'
import { type FC, Fragment } from 'react'

import { SushiIcon } from '../icons/SushiIcon'

interface LoaderProps extends React.ComponentProps<'svg'> {
  size?: number
  stroke?: string
  strokeWidth?: number
  className?: string
  circleClassName?: string
}

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export const Loader: FC<LoaderProps> = ({
  size = 16,
  strokeWidth = 2,
  circleClassName,
  className,
}) => {
  return (
    <svg
      className="animate-rotate"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7"
        cy="7"
        r="6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={classNames(
          circleClassName,
          'text-gray-400 dark:text-white/[0.12]',
        )}
      />
      <path
        d="M7 1C8.04257 1 9.06714 1.27166 9.97275 1.78821C10.8784 2.30476 11.6337 3.04837 12.1645 3.94575C12.6952 4.84313 12.9829 5.86332 12.9993 6.90576C13.0156 7.9482 12.7601 8.97691 12.2578 9.89052"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={classNames(className, 'text-gray-700 dark:text-white')}
      />
    </svg>
  )
}

/**
 * @deprecated
 */
export const LoadingOverlay: FC<{ show?: boolean }> = ({ show }) => {
  return (
    <Transition
      as={Fragment}
      show={show}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed z-[9999] flex items-center justify-center inset-0 transition-opacity bg-white bg-opacity-5 backdrop-blur-sm rounded-xl overflow-hidden">
        <LogoLoader width={36} height={36} />
      </div>
    </Transition>
  )
}

export const LogoLoader: FC<LoaderProps> = (props) => {
  return <SushiIcon className="animate-heartbeat" {...props} />
}
