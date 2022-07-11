import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, Fragment, ReactElement } from 'react'
import ReactDOM from 'react-dom'

import { useSlideInContext } from './SlideIn'

export type FromBottom = {
  show: boolean
  unmount: boolean
  onClose(): void
  afterEnter?(): void
  beforeEnter?(): void
  beforeLeave?(): void
  afterLeave?(): void
  children: ReactElement
  className?: string
}

export const FromBottom: FC<FromBottom> = ({
  show,
  beforeLeave,
  beforeEnter,
  unmount = false,
  afterEnter,
  afterLeave,
  onClose,
  children,
  className,
}) => {
  const portal = useSlideInContext()
  if (!portal) return <></>

  return ReactDOM.createPortal(
    <Transition.Root show={show} unmount={unmount} as={Fragment}>
      <div className={classNames(className, 'absolute left-0 right-0 bottom-0 h-full translate-y-[100%] z-50')}>
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
            className="translate-y-[-100%] absolute inset-0 bg-black/70 transition-opacity"
          />
        </Transition.Child>
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-y-0"
          enterTo="translate-y-[-100%]"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-y-[-100%]"
          leaveTo="translate-y-0"
          as={Fragment}
          afterLeave={afterLeave}
          afterEnter={afterEnter}
          beforeEnter={beforeEnter}
          beforeLeave={beforeLeave}
          unmount={false}
        >
          {children}
        </Transition.Child>
      </div>
    </Transition.Root>,
    portal
  )
}
