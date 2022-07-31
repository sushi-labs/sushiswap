import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import useScrollPosition from '@react-hook/window-scroll'
import React, { Fragment } from 'react'

import { classNames, Link, Select, SushiIcon } from '../index'

export enum AppType {
  Swap = 'Swap',
  Furo = 'Streaming',
  Blog = 'Blog',
  Legacy = 'Sushi 1.0',
  Internal = 'Internal',
  Kashi = 'Kashi',
  Analytics = 'Analytics',
  Pool = 'Pool',
}

const LINK = {
  [AppType.Swap]: '/swap',
  [AppType.Furo]: '/furo',
  [AppType.Blog]: '/blog',
  [AppType.Legacy]: '/',
  [AppType.Internal]: '/internal',
  [AppType.Kashi]: '/internal',
  [AppType.Analytics]: '/analytics',
}

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  nav?: JSX.Element
  withScrollBackground?: boolean
  appType: AppType
}

export function Header({
  children,
  appType,
  className,
  nav,
  withScrollBackground = false,
  ...props
}: HeaderProps): JSX.Element {
  const scrollY = useScrollPosition()

  return (
    <header
      className={classNames('sticky mt-0 flex items-center left-0 right-0 top-0 w-full z-[100] h-[54px]', className)}
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
        <div className="absolute inset-0 border-b pointer-events-none bg-slate-900 border-slate-200/10" />
      </Transition>
      <div className="grid grid-cols-3 items-center max-w-5xl w-full mx-auto z-[101] px-4">
        <div className="flex items-center gap-3">
          <a className="flex flex-row items-center gap-1.5" href={LINK[appType]}>
            <div className="w-6 h-6">
              <SushiIcon width="100%" height="100%" className="mr-2 hover:animate-heartbeat" />
            </div>
          </a>
          <div className="bg-slate-200/10 w-0.5 h-[20px]" />
          <Select
            button={
              <Listbox.Button
                type="button"
                className="flex items-center gap-2 font-semibold hover:text-slate-200 text-slate-300"
              >
                <span className="text-sm capitalize truncate">
                  {appType === AppType.Swap ? 'Explore Apps' : appType}
                </span>
                <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
              </Listbox.Button>
            }
          >
            <Select.Options className="w-[auto] !bg-slate-700 -ml-5 mt-4">
              {appType !== AppType.Swap && (
                <Select.Option
                  as="a"
                  href="https://sushi.com/swap"
                  key={AppType.Swap}
                  value={AppType.Swap}
                  className="!border-slate-700 !cursor-pointer"
                >
                  {AppType.Swap}
                </Select.Option>
              )}
              {appType !== AppType.Furo && (
                <Select.Option
                  as="a"
                  href="https://sushi.com/furo"
                  key={AppType.Furo}
                  value={AppType.Furo}
                  className="!border-slate-700 !cursor-pointer"
                >
                  {AppType.Furo}
                </Select.Option>
              )}
              <Select.Option
                as={Link.External}
                href="https://app.sushi.com"
                key={AppType.Legacy}
                value={AppType.Legacy}
                className="!border-slate-700 !cursor-pointer"
              >
                <span>{AppType.Legacy}</span>
                <ExternalLinkIcon width={14} height={14} />
              </Select.Option>
            </Select.Options>
          </Select>
        </div>
        <div className="flex justify-center">{nav}</div>
        <div className="flex justify-end">{children}</div>
      </div>
    </header>
  )
}

export default Header
