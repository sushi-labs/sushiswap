import { XIcon } from '@heroicons/react/outline'
import { IconButton } from '@sushiswap/ui'
import classNames from 'classnames'
import React from 'react'

export const Drawer = ({ children, isOpen, onClose, header }) => {
  return (
    <div
      className={classNames(
        'bg-slate-900 w-screen transform ease-in-out duration-300 z-[1080] h-screen fixed top-0 overflow-y-auto px-6 pt-6',
        isOpen ? '-translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between">
        <header className="text-2xl font-bold">{header}</header>
        <IconButton className="w-6 h-6" onClick={onClose}>
          <XIcon />
        </IconButton>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}
