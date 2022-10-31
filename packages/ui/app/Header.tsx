import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import useScrollPosition from '@react-hook/window-scroll'
import { useIsMounted } from '@sushiswap/hooks'
import React, { Fragment } from 'react'

import { classNames, Container, Link, MaxWidth, Select, SushiIcon, Typography, useBreakpoint } from '..'

export enum AppType {
  Root = 'Explore Apps',
  Blog = 'Blog',
  Bridge = 'Bridge',
  Swap = 'Swap',
  xSwap = 'xSwap',
  Furo = 'Streaming',
  Legacy = 'Sushi 1.0',
  Internal = 'Internal',
  Kashi = 'Lend & Borrow',
  Analytics = 'Analytics',
  Invest = 'Earn',
  Partner = 'Partner',
  Widget = 'Widget',
}

const LINK = {
  [AppType.Root]: '/',
  [AppType.Legacy]: '/',
  [AppType.Blog]: '/blog',
  [AppType.Bridge]: '/bridge',
  [AppType.Swap]: '/swap',
  [AppType.xSwap]: '/xswap',
  [AppType.Furo]: '/furo',
  [AppType.Internal]: '/internal',
  [AppType.Kashi]: '/kashi',
  [AppType.Analytics]: '/analytics',
  [AppType.Invest]: '/earn',
  [AppType.Partner]: '/partner',
  [AppType.Widget]: '/widget',
}

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  nav?: JSX.Element
  withScrollBackground?: boolean
  appType: AppType
  maxWidth?: MaxWidth
}

export function Header({
  children,
  appType,
  className,
  nav,
  withScrollBackground = false,
  maxWidth = '5xl',
  ...props
}: HeaderProps): JSX.Element {
  const isMounted = useIsMounted()
  const scrollY = useScrollPosition()

  const { isMd } = useBreakpoint('md')

  // Show when:
  // 1. We scroll down for 45px
  // 2. When body has a negative top set for body lock for Dialogs on small screens
  const showBackground =
    (scrollY > 45 && withScrollBackground && isMounted) ||
    (typeof window !== 'undefined' && !isMd
      ? Number(document.body.style.top.slice(0, -2)) < 0 && withScrollBackground
      : false)

  return (
    <header
      className={classNames('sticky mt-0 flex items-center left-0 right-0 top-0 w-full z-[1070] h-[54px]', className)}
      {...props}
    >
      <Transition
        as={Fragment}
        show={showBackground || !withScrollBackground}
        enter="transform transition ease-in-out duration-100"
        enterFrom="translate-y-[-100%]"
        enterTo="translate-y-0"
        leave="transform transition ease-in-out duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-[-100%]"
      >
        <div className="absolute inset-0 border-b pointer-events-none bg-slate-900 border-slate-200/10" />
      </Transition>
      <Container
        maxWidth={maxWidth}
        className={classNames('grid grid-cols-3 items-center w-full mx-auto z-[101] px-4')}
      >
        <div className="flex items-center gap-3">
          <a className="flex flex-row items-center gap-1.5" href="/">
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
                <span className="text-sm truncate">{AppType.Root}</span>
                <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
              </Listbox.Button>
            }
          >
            <Select.Options className="w-[max-content] !bg-slate-700 -ml-5 mt-5 !max-h-[unset]">
              <div className="grid grid-cols-1 gap-1 px-2 py-2 md:grid-cols-3">
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-400">
                    Core
                  </Typography>
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/swap"
                    key={AppType.Swap}
                    value={AppType.Swap}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.Swap}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      The easiest way to trade
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/xswap"
                    key={AppType.xSwap}
                    value={AppType.xSwap}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.xSwap}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Cross-chain swapping made easy
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/earn"
                    key={AppType.Invest}
                    value={AppType.Invest}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.Invest}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Earn fees by providing liquidity
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-400">
                    Products
                  </Typography>
                  {/* <Select.Option
                    as="a"
                    href="https://www.sushi.com/kashi"
                    key={AppType.Kashi}
                    value={AppType.Kashi}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    Kashi
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Lend & borrow money
                    </Typography>
                  </Select.Option> */}
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/furo"
                    key={AppType.Furo}
                    value={AppType.Furo}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.Furo}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Automate DAO salaries and vesting schedules
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/analytics"
                    key={AppType.Analytics}
                    value={AppType.Analytics}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.Analytics}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Find the best opportunities
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-400">
                    Links
                  </Typography>
                  <Select.Option
                    as="a"
                    href="https://www.sushi.com/blog"
                    key={AppType.Blog}
                    value={AppType.Blog}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    {AppType.Blog}
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Stay up to date with Sushi
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as={Link.External}
                    href="https://app.sushi.com"
                    key={AppType.Legacy}
                    value={AppType.Legacy}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start !no-underline group"
                  >
                    <div className="flex items-center gap-1">
                      <span>{AppType.Legacy}</span>
                      <ExternalLinkIcon width={14} height={14} />
                    </div>
                    <Typography variant="xs" className="text-slate-400 group-hover:text-blue-100">
                      Prefer the old app?
                    </Typography>
                  </Select.Option>
                </div>
              </div>
            </Select.Options>
          </Select>
        </div>
        <div className="flex justify-center">{nav}</div>
        <div className="flex justify-end">{children}</div>
      </Container>
    </header>
  )
}

export default Header
