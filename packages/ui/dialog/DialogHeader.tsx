import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { Typography } from '..'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose }) => {
  return (
    <div className="flex items-start justify-between">
      <div
        aria-hidden="true"
        className={classNames(onBack ? 'cursor-pointer' : '', 'flex gap-2 items-center')}
        {...(onBack && { onClick: onBack })}
      >
        {onBack && (
          <div className="rounded-full flex items-center justify-center cursor-pointer">
            <ChevronLeftIcon width={24} height={24} className="cursor-pointer text-slate-100 hover:text-slate-50" />
          </div>
        )}
        <Typography weight={700} as="h3" className="flex gap-4 text-lg font-bold leading-6 text-slate-100">
          {title}
        </Typography>
      </div>
      {onClose ? (
        <div aria-hidden="true" className="flex items-center justify-center cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className="hover:text-slate-50 text-slate-100" />
        </div>
      ) : (
        <span />
      )}
    </div>
  )
}

export default DialogHeader
