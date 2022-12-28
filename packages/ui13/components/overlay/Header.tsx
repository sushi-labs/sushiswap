import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { FC } from 'react'

import { Button } from '../button'

export interface Header {
  title: string
  onBack?(): void
  onClose?(): void
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<Header> = ({ className, title, onBack, onClose, arrowDirection = 'left' }) => {
  return (
    <div className={classNames(className, 'grid grid-cols-[40px_auto_40px] mb-3')}>
      {onBack ? (
        <Button
          variant="outlined"
          color="default"
          size="md"
          className="!px-0 !w-[38px] flex items-center justify-center gap-2 cursor-pointer"
          onClick={onBack}
        >
          {arrowDirection === 'left' && (
            <ArrowLeftIcon strokeWidth={3} width={20} height={20} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'bottom' && (
            <ChevronDownIcon strokeWidth={3} width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'top' && (
            <ChevronUpIcon strokeWidth={3} width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
          {arrowDirection === 'right' && (
            <ChevronRightIcon strokeWidth={3} width={24} height={24} className={classNames('cursor-pointer ')} />
          )}
        </Button>
      ) : (
        <div />
      )}
      <h3
        className={classNames(
          'font-medium flex-grow flex items-center justify-center gap-4 text-lg font-medium leading-6'
        )}
      >
        {title}
      </h3>
      {onClose ? (
        <div className="flex justify-end">
          <Button
            variant="outlined"
            color="default"
            size="md"
            className="!px-0 !w-[38px] flex items-center justify-center gap-2 cursor-pointer"
            onClick={onBack}
          >
            <XMarkIcon width={24} height={24} />
          </Button>
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}
