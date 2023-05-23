import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { classNames, IconButton } from '@sushiswap/ui'
import React, { FC, Fragment, ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface Drawer {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  header?: ReactNode
}

export const Drawer: FC<Drawer> = ({ children, isOpen, onClose, className, header }) => {
  const isMounted = useIsMounted()

  if (!isMounted) return <></>

  return ReactDOM.createPortal(
    <Transition.Root appear show={isOpen} unmount={false} as={Fragment}>
      <div className={classNames(className, 'fixed right-0 top-0 bottom-0 w-full translate-x-[100%] z-[1080]')}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
        >
          <div
            aria-hidden="true"
            onClick={onClose}
            className="translate-x-[-100%] absolute inset-0 bg-slate-900 transition-opacity"
          />
        </Transition.Child>
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-0"
          enterTo="translate-x-[-100%]"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-[-100%]"
          leaveTo="translate-x-0"
          unmount={false}
        >
          <div className={classNames('relative overflow-y-auto', className)}>
            <div className="z-[1] py-[34px] sticky top-0 bg-slate-900">{header}</div>
            <div className="z-[1] fixed right-6 top-[38px]" onClick={onClose}>
              <IconButton className="w-6 h-6 text-slate-50/50" onClick={onClose}>
                <XMarkIcon />
              </IconButton>
            </div>
            <div className="px-[30px]">{children}</div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>,
    document.body
  )
}
