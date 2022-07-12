import { Transition } from '@headlessui/react'
import useScrollPosition from '@react-hook/window-scroll'
import { Fragment } from 'react'

import { classNames } from '../index'

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  brand?: JSX.Element
  nav?: JSX.Element
  withScrollBackground?: boolean
}

export function Header({
  children,
  className,
  brand,
  nav,
  withScrollBackground = false,
  ...props
}: HeaderProps): JSX.Element {
  const scrollY = useScrollPosition()

  return (
    <header
      className={classNames('fixed flex items-center left-0 right-0 top-0 w-full z-[100] h-[54px]', className)}
      {...props}
    >
      <Transition
        as={Fragment}
        show={scrollY > 45 && withScrollBackground}
        enter="transform transition ease-in-out duration-100"
        enterFrom="translate-y-[-100%]"
        enterTo="translate-y-0"
        leave="transform transition ease-in-out duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-[-100%]"
      >
        <div className="bg-slate-900 border-slate-200/10 border-b absolute inset-0 pointer-events-none" />
      </Transition>
      <div className="grid grid-cols-3 items-center max-w-5xl w-full mx-auto z-[101] px-4">
        {brand}
        <div className="flex justify-center">{nav}</div>
        <div className="flex justify-end">{children}</div>
      </div>
    </header>
  )
}

export default Header
