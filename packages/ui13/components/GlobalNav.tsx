import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { FC, Fragment, ReactElement, ReactNode } from 'react'

import { APP_TYPE_LINKS, HEADER_HEIGHT } from '../constants'
import { AppType } from '../types'

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
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={classNames(
        'fixed flex items-center left-0 right-0 top-0 z-[1070] border-b border-slate-200/5',
        className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full mx-auto z-[101] px-4">
        <div className="flex items-center">
          <a className="flex flex-row items-center pr-4" href="/">
            <div className="w-7 h-7">
              <img
                alt="logo"
                src="https://res.cloudinary.com/sushi-cdn/image/upload/v1670419151/xmaslogo1-trimmy_puyjsw.png"
                width={28}
                height={28}
              />
            </div>
          </a>
          <Menu as="div" className="relative">
            <Menu.Button className="text-sm font-semibold text-slate-300 hover:text-white">{appType}</Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute left-0 rounded-md p-2 w-[max-content] !bg-slate-700 -ml-4 mt-4 !max-h-[unset] grid grid-cols-1 gap-1 p-2 lg:grid-cols-3">
                {ITEMS.map((el) => (
                  <div key={el.label}>
                    <p className="text-xs font-bold hidden p-2 uppercase lg:block text-slate-400">{el.label}</p>
                    {el.items.map((item) => (
                      <Menu.Item
                        key={item.type}
                        as="a"
                        href={APP_TYPE_LINKS[item.type]}
                        className="py-2 text-sm font-medium !border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group hover:text-white"
                      >
                        {item.type}
                        <p className="text-xs text-slate-400 group-hover:text-blue-100">{item.subtitle}</p>
                      </Menu.Item>
                    ))}
                  </div>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div className="hidden md:flex justify-center relative h-[38px]">{children}</div>
        <div className="flex items-center justify-end gap-2">{rightElement}</div>
      </div>
    </header>
  )
}

type NavLinkProps = { title: string; href: string }

export const NavLink: FC<NavLinkProps> = ({ title, href }) => {
  return (
    <a
      href={href}
      className="flex text-slate-300 hover:text-white items-center font-semibold text-sm px-3 h-[36px] hover:bg-white/[0.04] rounded-lg transition-all"
    >
      {title}
    </a>
  )
}
