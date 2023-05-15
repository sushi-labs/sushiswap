import { Menu, Transition } from '@headlessui/react'
import useScrollPosition from '@react-hook/window-scroll'
import classNames from 'classnames'
import React, { FC, Fragment, ReactElement, ReactNode, useState } from 'react'

import { APP_TYPE_LINKS, HEADER_HEIGHT } from '../../constants'
import { AppType } from '../../types'
import { Button } from './button'
import { SushiIcon } from './icons'
import { MaxWidth } from '../../container'
import Container from './Container'
import { ArrowSmallRightIcon } from '@heroicons/react/20/solid'

const ITEMS = [
  {
    label: 'Core',
    items: [
      { type: AppType.Swap, subtitle: 'The easiest way to trade' },
      { type: AppType.Earn, subtitle: 'Earn fees by providing liquidity' },
    ],
  },
  {
    label: 'Products',
    items: [
      {
        type: AppType.Furo,
        subtitle: 'Automate salaries and vesting schedules',
      },
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
  children?: ReactElement<NavLinkProps> | Array<ReactElement<NavLinkProps>>
  rightElement?: ReactNode
  transparent?: boolean
  maxWidth?: MaxWidth
}

export const GlobalNav: FC<HeaderProps> = ({
  className,
  children,
  rightElement,
  transparent = false,
  maxWidth = 'full',
}) => {
  const [open, setOpen] = useState(false)
  const scrollY = useScrollPosition()

  const showBackground = scrollY > HEADER_HEIGHT - 10 && !className?.includes('relative')

  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={classNames(
        showBackground
          ? 'bg-gray-100 dark:bg-slate-900 lg:dark:border-slate-200/5 lg:border-gray-300/70 lg:border-b'
          : 'lg:border-transparent',
        transparent ? '' : 'bg-gray-100 dark:bg-slate-900 border-gray-300/70 dark:border-slate-200/5 border-b',
        'sticky flex items-center top-0 z-[1070] transition-all',
        className
      )}
    >
      <Container maxWidth={maxWidth} style={{ height: HEADER_HEIGHT }} className="mx-auto flex items-center">
        <div className="grid grid-cols-2 items-center w-full mx-auto z-[101] px-4">
          <div className="flex items-center sm:gap-2">
            <a className="flex flex-row items-center sm:pl-2 sm:pr-6" href="/">
              <div className="w-7 h-7 sm:w-8 sm:h-8">
                <SushiIcon width="100%" height="100%" className="sm:mr-2" />
              </div>
            </a>
            <Menu as="div" className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              <Menu.Button color="default" as={Button} variant="empty" size="md">
                Explore
              </Menu.Button>
              <Transition
                show={open}
                enter="transition duration-300 ease-out"
                enterFrom="transform translate-y-[-16px]"
                enterTo="transform translate-y-0"
                leave="transition duration-300 ease-out"
                leaveFrom="transform translate-y-0 opacity-100"
                leaveTo="transform translate-y-[-16px] opacity-0"
              >
                <div className="absolute pt-2 w-[max-content]">
                  <Menu.Items className="rounded-2xl p-3 w-[max-content] bg-white shadow-md dark:bg-slate-800 !max-h-[unset]">
                    <a
                      href="https://www.sushi.com"
                      className="cursor-pointer p-2 text-lg font-semibold flex gap-2 items-center hover:text-blue"
                    >
                      Discover Sushi <ArrowSmallRightIcon width={24} height={24} strokeWidth={5} />
                    </a>
                    <div className="grid grid-cols-1 gap-1 lg:grid-cols-3">
                      {ITEMS.map((el) => (
                        <div key={el.label}>
                          <p className="hidden font-semibold p-2 lg:block text-gray-900 dark:text-slate-50">
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
            <div className="hidden md:flex justify-center gap-2 relative h-[38px]">{children}</div>
          </div>
          <div className="flex items-center justify-end gap-2">{rightElement}</div>
        </div>
      </Container>
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
      className="font-medium transition-all relative text-gray-500 dark:text-slate-200 hover:bg-gray-100 hover:dark:bg-slate-600/40 hover:dark:text-blue hover:text-blue transition-all rounded-lg py-2 text-sm !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
    >
      <span className="pr-10">
        {type}
        <p className="max-w-[200px] font-normal text-xs text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-400 group-hover:text-blue">
          {subtitle}
        </p>
      </span>
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
          <ArrowSmallRightIcon width={24} height={24} strokeWidth={5} className="text-blue" />
        </div>
      </Transition>
    </Menu.Item>
  )
}

type NavLinkProps = { title: string; href: string }

export const NavLink: FC<NavLinkProps> = ({ title, href }) => {
  return (
    <Button as="a" color="default" href={href} variant="empty" size="md">
      {title}
    </Button>
  )
}

export const SubNav: FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Menu as="div" className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Menu.Button color="default" as={Button} variant="empty" size="md">
        {title}
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
            <div className="flex flex-col gap-1">{children}</div>
          </Menu.Items>
        </div>
      </Transition>
    </Menu>
  )
}

export const SubNavLink: FC<{ href: string; title: string }> = ({ href, title }) => {
  const [hover, setHover] = useState(false)

  return (
    <Menu.Item
      as="a"
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="font-medium transition-all relative text-gray-500 dark:text-slate-400 hover:bg-gray-100 hover:dark:bg-slate-600/40 hover:dark:text-blue-400 hover:text-blue hover:dark:text-white transition-all rounded-lg py-2 text-sm !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
    >
      <div className="pr-10">{title}</div>
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
          <ArrowSmallRightIcon width={24} height={24} strokeWidth={5} className="text-blue" />
        </div>
      </Transition>
    </Menu.Item>
  )
}
