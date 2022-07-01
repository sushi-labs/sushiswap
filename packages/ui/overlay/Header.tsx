import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, XIcon } from '@heroicons/react/outline'
import { FC } from 'react'

import { classNames, IconButton } from '../index'
import { Typography } from '../typography'

export interface Header {
  title: string
  onClose(): void
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<Header> = ({ className, title, onClose, arrowDirection = 'left' }) => {
  return (
    <div
      className={classNames(
        className,
        'flex items-center justify-between absolute top-0 left-0 right-0 px-3 h-[48px] border-b border-slate-200/5'
      )}
    >
      <IconButton className="flex items-center justify-center gap-2 cursor-pointer" onClick={onClose}>
        {arrowDirection === 'left' && (
          <ChevronLeftIcon width={24} height={24} className={classNames('cursor-pointer ')} />
        )}
        {arrowDirection === 'bottom' && (
          <ChevronDownIcon width={24} height={24} className={classNames('cursor-pointer ')} />
        )}
        {arrowDirection === 'top' && <ChevronUpIcon width={24} height={24} className={classNames('cursor-pointer ')} />}
        {arrowDirection === 'right' && (
          <ChevronRightIcon width={24} height={24} className={classNames('cursor-pointer ')} />
        )}
      </IconButton>
      <Typography weight={700} as="h3" className={classNames('flex gap-4 text-lg font-bold leading-6 ')}>
        {title}
      </Typography>
      <IconButton className="flex items-center justify-center cursor-pointer" onClick={onClose}>
        <XIcon width={24} height={24} />
      </IconButton>
    </div>
  )
}
