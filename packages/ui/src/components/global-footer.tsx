'use client'

import dynamic from 'next/dynamic'
import { type ReactNode, useCallback } from 'react'
import { DiscordIcon } from '../icons/DiscordIcon'
import { GithubIcon } from '../icons/GithubIcon'
import { InstagramIcon } from '../icons/InstagramIcon'
import { SushiWithTextIcon } from '../icons/SushiWithTextIcon'
import { TwitterIcon } from '../icons/TwitterIcon'
import type { ExtractProps } from '../types'
import { Container, type ContainerProps } from './container'
import { LinkExternal } from './link'

export interface FooterProps
  extends React.HTMLProps<HTMLDivElement>,
    Pick<ExtractProps<ContainerProps>, 'maxWidth'> {
  children?: ReactNode
}

const config: Record<
  string,
  | Record<string, { href: string; rel?: string; target?: string }>
  | Record<
      string,
      Record<string, { href: string; rel?: string; target?: string }>
    >[]
> = {
  Services: {
    Swap: { href: 'https://www.sushi.com/swap' },
    Earn: { href: 'https://www.sushi.com/earn' },
    Payments: { href: 'https://www.sushi.com/furo' },
    Analytics: { href: 'https://www.sushi.com/analytics' },
  },
  Help: {
    Academy: {
      href: 'https://www.sushi.com/academy',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'About Us': {
      href: 'https://docs.sushi.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Discord Support': {
      href: 'https://sushi.com/discord',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Twitter Support': {
      href: 'https://twitter.com/sushiswap',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Forum Support': {
      href: 'https://forum.sushi.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
  Developers: {
    GitBook: {
      href: 'https://docs.sushi.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    GitHub: {
      href: 'https://github.com/sushiswap',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    Development: {
      href: 'https://docs.sushi.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    SushiGuard: {
      href: 'https://docs.openmev.org',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
  Items: [
    {
      Governance: {
        'Forum & Proposals': {
          href: 'https://forum.sushi.com',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        Vote: {
          href: 'https://snapshot.org/#/sushigov.eth',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    },
    {
      Partners: {
        KlimaDAO: {
          href: 'https://www.klimadao.finance/',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Manifold Finance': {
          href: 'https://www.manifoldfinance.com/',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    },
  ],
  Protocol: {
    'Apply for Onsen': {
      href: 'https://docs.google.com/document/d/1VcdrqAn1sR8Wa0BSSU-jAl68CfoECR62LCzIyzUpZ_U',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
}

const Component = ({ children, maxWidth = '5xl', ...props }: FooterProps) => {
  const leafNode = useCallback(
    (
      title: string,
      items: Record<string, { href: string; rel?: string; target?: string }>,
    ) => {
      return (
        <div key={title} className="flex flex-col gap-[10px]">
          <span className="font-semibold tracking-tighter text-sm sm:text-xs text-gray-900 dark:text-slate-100">
            {title}
          </span>
          {Object.entries(items).map(([item, { href, rel, target }]) => (
            <a
              key={item}
              href={href}
              target={target}
              rel={rel}
              className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      )
    },
    [],
  )

  return (
    <footer
      className="bg-secondary hidden sm:flex flex-col pt-[72px]"
      {...props}
    >
      <Container
        maxWidth={maxWidth}
        className="grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4"
      >
        <div className="col-span-2">{children && children}</div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-start gap-3 pt-2">
            <SushiWithTextIcon
              height={20}
              className="text-gray-700 dark:text-slate-50"
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400">
            Our community is building a comprehensive decentralized trading
            platform for the future of finance. Join us!
          </p>
          <div className="flex items-center gap-4">
            <LinkExternal href="https://github.com/sushiswap">
              <GithubIcon
                width={16}
                className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
              />
            </LinkExternal>
            <LinkExternal href="https://twitter.com/sushiswap">
              <TwitterIcon
                width={16}
                className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
              />
            </LinkExternal>
            <LinkExternal href="https://instagram.com/instasushiswap">
              <InstagramIcon
                width={16}
                className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
              />
            </LinkExternal>
            <LinkExternal href="https://sushi.com/discord">
              <DiscordIcon
                width={16}
                className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
              />
            </LinkExternal>
          </div>
        </div>
        <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-[40px] sm:mt-[10px]">
          {Object.entries(config).map(([title, items], i) => {
            if (Array.isArray(items)) {
              return (
                <div key={i} className="flex flex-col gap-6">
                  {items.map((item) =>
                    Object.entries(item).map(([_title, _items]) => {
                      return leafNode(_title, _items)
                    }),
                  )}
                </div>
              )
            } else {
              return leafNode(title, items)
            }
          })}
        </div>
      </Container>
      <Container maxWidth={maxWidth} className="mx-auto mt-20 mb-3">
        <div className="flex justify-between py-2 mx-4 border-t border-accent">
          <span className="text-xs text-gray-600 dark:text-slate-400">
            Copyright © 2023 Sushi. All rights reserved.
          </span>
          <div className="flex divide-x dark:divide-slate-200/20 gap-">
            <a
              href="https://www.sushi.com/legal/terms-of-use"
              className="text-xs font-medium px-3 text-gray-600 dark:text-slate-300"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export const GlobalFooter = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
