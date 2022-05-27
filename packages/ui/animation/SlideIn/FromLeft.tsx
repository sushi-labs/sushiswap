import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { FC, Fragment, ReactElement } from 'react'

type FromLeft = {
  show: boolean
  unmount: boolean
  onClose(): void
  afterEnter?(): void
  beforeEnter?(): void
  beforeLeave?(): void
  afterLeave?(): void
  children: ReactElement
}

export const FromLeft: FC<FromLeft> = ({
  show,
  beforeLeave,
  beforeEnter,
  unmount = false,
  afterEnter,
  afterLeave,
  onClose,
  children,
}) => {
  return (
    <Transition.Root show={show} unmount={unmount} as={Fragment}>
      <div className={classNames('absolute inset-0 translate-x-[-100%] z-50')}>
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
            className="translate-x-full absolute inset-0 bg-black/70 transition-opacity"
          />
        </Transition.Child>
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-0"
          enterTo="translate-x-full"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-full"
          leaveTo="translate-x-0"
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
    </Transition.Root>
  )
}
