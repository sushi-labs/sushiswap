import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { Typography } from '..'
import { IconButton } from '../iconbutton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?(): void
  onBack?(): void
  className?: string
  children?: ReactNode | Array<ReactNode>
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, className, children }) => {
  return (
    <div
      className={classNames(
        className,
        'grid grid-cols-[40px_auto_40px] items-center absolute top-0 left-0 right-0 px-3 border-b border-slate-200/5 h-12'
      )}
    >
      {children ? (
        children
      ) : onBack ? (
        <IconButton onClick={onBack} className="rounded-full flex items-center justify-center cursor-pointer">
          <ChevronLeftIcon width={24} height={24} className="cursor-pointer text-slate-100 hover:text-slate-50" />
        </IconButton>
      ) : (
        <div />
      )}

      <Typography weight={700} as="h3" className="flex justify-center text-lg font-bold leading-6 text-slate-100">
        {title}
      </Typography>

      <div className="flex justify-end">
        {onClose ? (
          <IconButton className="cursor-pointer" onClick={onClose}>
            <XIcon width={24} height={24} className="hover:text-slate-50 text-slate-100" />
          </IconButton>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

export default DialogHeader
