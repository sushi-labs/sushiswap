import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { FC } from 'react'

import { classNames, IconButton } from '../index'
import { Typography } from '../typography'

export interface Header {
  title: string
  onBack?(): void
  onClose?(): void
  border?: boolean
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<Header> = ({ className, title, border = true, onBack, onClose, arrowDirection = 'left' }) => {
  return (
    <div
      className={classNames(
        className,
        border ? 'border-b border-slate-200/5' : '',
        'grid grid-cols-[40px_auto_40px] absolute top-0 left-0 right-0 px-3 h-[48px]'
      )}
    >
      {onBack ? (
        <IconButton className="flex items-center justify-center gap-2 cursor-pointer" onClick={onBack}>
          {arrowDirection === 'left' && (
            <ChevronLeftIcon width={24} height={24} className={classNames('cursor-pointer ')} />
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
      <Typography
        weight={500}
        as="h3"
        className={classNames('flex items-center justify-center gap-4 text-lg font-medium leading-6')}
      >
        {title}
      </Typography>
      {onClose ? (
        <div className="flex items-center justify-end">
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
