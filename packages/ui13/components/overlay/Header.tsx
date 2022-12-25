import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { FC } from 'react'

import { IconButton } from '../IconButton'

export interface Header {
  title: string
  onBack?(): void
  onClose?(): void
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<Header> = ({ className, title, onBack, onClose, arrowDirection = 'left' }) => {
  return (
    <div className={classNames(className, 'grid grid-cols-[40px_auto_40px] top-0 left-0 right-0 h-[48px] mb-6')}>
      {onBack ? (
        <IconButton className="flex items-center justify-center gap-2 cursor-pointer" onClick={onBack}>
          {arrowDirection === 'left' && (
            <ArrowLeftIcon width={20} height={20} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'bottom' && (
            <ChevronDownIcon width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'top' && (
            <ChevronUpIcon width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'right' && (
            <ChevronRightIcon width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
        </IconButton>
      ) : (
        <div />
      )}
      <h3 className={classNames('font-medium flex items-center justify-center gap-4 text-lg font-medium leading-6')}>
        {title}
      </h3>
      {onClose ? (
        <div className="flex items-center justify-center">
          <IconButton className="flex items-center justify-end cursor-pointer" onClick={onClose}>
            <XMarkIcon width={24} height={24} />
          </IconButton>
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}
