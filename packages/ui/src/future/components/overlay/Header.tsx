import { XMarkIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import React, { FC } from 'react'

import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { IconButton } from '../iconbutton'

export interface Header {
  title: string
  onBack?(): void
  onClose?(): void
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<Header> = ({ className, title, onBack, onClose, arrowDirection = 'left' }) => {
  return (
    <div className={classNames(className, 'grid grid-cols-[40px_auto_40px] pb-2')}>
      {onBack && (
        <IconButton
          icon={
            arrowDirection === 'left'
              ? ArrowLeftIcon
              : arrowDirection === 'right'
              ? ArrowRightIcon
              : arrowDirection === 'top'
              ? ArrowUpIcon
              : ArrowDownIcon
          }
          iconProps={{
            width: 24,
            height: 24,
          }}
          className="flex items-center justify-center w-6 h-6 gap-2 cursor-pointer"
          onClick={onBack}
          name="Back"
        />
      )}
      <h3
        className={classNames(
          'font-medium flex-grow flex items-center justify-center gap-4 text-lg font-medium leading-6'
        )}
      >
        {title}
      </h3>
      {onClose && (
        <IconButton
          icon={XMarkIcon}
          iconProps={{
            width: 24,
            height: 24,
          }}
          className="cursor-pointer"
          onClick={onClose}
          name="close"
        />
      )}
    </div>
  )
}
