import { Menu, Transition } from '@headlessui/react'
import { ArrowLongRightIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import React, { FC, Fragment, ReactElement, ReactNode, useState } from 'react'

import { APP_TYPE_LINKS, HEADER_HEIGHT } from '../constants'
import { AppType } from '../types'
import { SushiIcon } from './icons'

const ITEMS = [
  {
    label: 'Core',
    items: [
      { type: AppType.Swap, subtitle: 'The easiest way to trade' },
      { type: AppType.xSwap, subtitle: 'Cross-chain swapping made easy' },
      { type: AppType.Earn, subtitle: 'Earn fees by providing liquidity' },
    ],
  },
  {
    label: 'Products',
    items: [
      { type: AppType.Furo, subtitle: 'Automate DAO salaries and vesting schedules' },
      { type: AppType.Analytics, subtitle: 'Find the best opportunities' },
    ],
  },
  {
    label: 'Links',
    items: [
      { type: AppType.Blog, subtitle: 'Stay up to date with Sushi' },
      { type: AppType.Academy, subtitle: 'Demystifying DeFi' },
      { type: AppType.Legacy, subtitle: 'Prefer the old app?' },
    ],
  },
]

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  appType: AppType
  children?: ReactElement<NavLinkProps> | Array<ReactElement<NavLinkProps>>
  rightElement?: ReactNode
}

export const GlobalNav: FC<HeaderProps> = ({ appType, className, children, rightElement }) => {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={classNames(
        'fixed flex items-center left-0 right-0 top-0 z-[1070] border-b border-gray-300/70 dark:border-slate-200/5 bg-gray-200/70 dark:bg-slate-900 backdrop-blur-md backdrop-saturate-[3]',
        className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full mx-auto z-[101] px-4">
        <div className="flex items-center">
          <a className="flex flex-row items-center pr-4" href="/">
            <div className="w-7 h-7">
              <SushiIcon width="100%" height="100%" className="mr-2 hover:animate-heartbeat" />
            </div>
          </a>
          <Menu as="div" className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <Menu.Button
              className={classNames(
                open ? 'bg-white' : '',
                'hover:bg-white hover:dark:bg-slate-800 py-1.5 px-4 font-medium rounded-lg dark:text-slate-300 text-gray-900 hover:dark:text-white'
              )}
            >
              Explore
            </Menu.Button>
            <Transition
              show={open}
              enter="transition duration-300 ease-out"
              enterFrom="transform translate-y-[-16px] opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-300 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform translate-y-[-16px] opacity-0"
            >
              <div className="absolute pt-2 w-[max-content]">
                <Menu.Items className="rounded-2xl p-3 w-[max-content] bg-white shadow-md dark:bg-slate-700 !max-h-[unset]">
                  <a
                    href="https://sushi.com"
                    className="cursor-pointer p-2 text-lg font-semibold flex gap-2 items-center hover:text-blue"
                  >
                    Discover Sushi <ArrowRightIcon width={18} height={18} strokeWidth={20} />
                  </a>
                  <div className="grid grid-cols-1 gap-1 lg:grid-cols-3">
                    {ITEMS.map((el) => (
                      <div key={el.label}>
                        <p className="text-sm hidden font-semibold p-2 lg:block text-gray-900 dark:text-slate-50">
                          {el.label}
                        </p>
                        {el.items.map((item) => (
                          <MenuItem key={item.type} subtitle={item.subtitle} type={item.type} />
                        ))}
                      </div>
                    ))}
                  </div>
                </Menu.Items>
              </div>
            </Transition>
          </Menu>
        </div>
        <div className="hidden md:flex justify-center relative h-[38px]">{children}</div>
        <div className="flex items-center justify-end gap-2">{rightElement}</div>
      </div>
    </header>
  )
}

export const MenuItem: FC<{ subtitle: string; type: AppType }> = ({ subtitle, type }) => {
  const [hover, setHover] = useState(false)
  return (
    <Menu.Item
      key={type}
      as="a"
      href={APP_TYPE_LINKS[type]}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="font-medium transition-all relative text-gray-500 dark:text-slate-400 hover:bg-gray-100 hover:dark:bg-slate-600/40 hover:dark:text-blue-400 hover:text-blue hover:dark:text-white transition-all rounded-lg py-2 text-sm !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
    >
      {type}
      <p className="font-normal text-xs text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-400 group-hover:text-blue">
        {subtitle}
      </p>
      <ArrowRightIcon width={16} height={16} className="hidden hover:flex absolute right-2" />
      <Transition
        as={Fragment}
        show={hover}
        enter="ease-in-out duration-300"
        enterFrom="translate-x-[10px] opacity-0"
        enterTo="translate-x-[-10px] opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-[-10px] opacity-100"
        leaveTo="translate-x-[10px] opacity-0"
        unmount={false}
      >
        <div className="absolute right-0 top-0 bottom-0 flex justify-center items-center">
          <ArrowLongRightIcon width={20} height={20} strokeWidth={5} className="text-blue" />
        </div>
      </Transition>
    </Menu.Item>
  )
}

type NavLinkProps = { title: string; href: string }

export const NavLink: FC<NavLinkProps> = ({ title, href }) => {
  return (
    <a
      href={href}
      className="hover:bg-white text-md hover:dark:bg-slate-800 py-1.5 px-4 rounded-lg dark:text-slate-300 text-gray-900 hover:dark:text-white"
    >
      {title}
    </a>
  )
}
