import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import React, { FC } from 'react'

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
          size="sm"
          icon={
            arrowDirection === 'left'
              ? ArrowLeftIcon
              : arrowDirection === 'right'
              ? ArrowRightIcon
              : arrowDirection === 'top'
              ? ArrowUpIcon
              : ArrowDownIcon
          }
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
      {onClose && <IconButton size="sm" icon={XMarkIcon} onClick={onClose} name="close" />}
    </div>
  )
}
