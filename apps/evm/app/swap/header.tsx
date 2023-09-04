'use client'

import { ChartBarIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { ArrowsRightLeftIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import { PlayIcon } from '@heroicons/react/24/solid'
import { DotsVerticalIcon } from '@heroicons/react-v1/solid'
import { IconButton, SushiIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import React, { FC } from 'react'

export const NAVIGATION_LINK = [
  {
    title: 'Swap',
    href: '/swap',
    icon: ArrowsRightLeftIcon,
  },
  {
    title: 'Pool',
    href: '/pool',
    icon: CircleStackIcon,
  },
  {
    title: 'Pay',
    href: '/furo',
    icon: PlayIcon,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
  },
]

export const Header: FC = () => {
  const [showMore, setShowMore] = React.useState(false)

  return (
    <div className="border-r border-accent">
      <div className="px-3 flex items-center">
        <a className="px-2 py-6" href="/">
          <div className="w-8 h-8">
            <SushiIcon width={32} height={32} className="w-8 h-8 mr-4" />
          </div>
        </a>
      </div>
      <div className="px-3 w-full">
        <div className="pb-4">
          <div className="grid grid-flow-row gap-1 auto-rows-max">
            {NAVIGATION_LINK.map(({ href, title, icon: Icon }) => (
              <TooltipProvider key={href}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <a
                      className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                      href={href}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="pl-4 hidden xl:block">{title}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right">{title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <button
                    onClick={() => setShowMore(true)}
                    className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                  >
                    <DotsVerticalIcon className="w-5 h-5" />
                    <span className="pl-4 hidden xl:block">More</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">More</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div
        data-state={showMore ? 'open' : 'closed'}
        className="data-[state=open]:fixed data-[state=closed]:hidden transition-all bg-background left-[220px] w-[220px] top-0 bottom-0 border-r border-accent"
      >
        <div className="pl-5 pr-2 h-[80px] border-b border-accent flex items-center justify-between">
          <h1 className="font-semibold text-2xl tracking-tighter">Sushi</h1>
          <IconButton onClick={() => setShowMore(false)} variant="ghost" name="close" icon={XMarkIcon} />
        </div>
        <div className="py-3">
          <div className="px-3 pb-4 border-b border-accent">
            <span className="flex h-[42px] items-center px-2 uppercase text-xs  text-gray-400 dark:text-slate-500 font-bold">
              Resources
            </span>
            <div className="grid grid-flow-row gap-1 auto-rows-max">
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/blog"
              >
                Governance
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/blog"
              >
                Forum
              </a>
            </div>
          </div>
          <div className="px-3 pb-4 border-b border-accent">
            <span className="flex h-[42px] items-center px-2 uppercase text-xs  text-gray-400 dark:text-slate-500 font-bold">
              For Individuals
            </span>
            <div className="grid grid-flow-row gap-1 auto-rows-max">
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/academy"
              >
                Academy
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/blog"
              >
                Blog
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/academy"
              >
                Support
              </a>
            </div>
          </div>
          <div className="px-3 pb-4 border-b border-accent">
            <span className="flex h-[42px] items-center px-2 uppercase text-xs  text-gray-400 dark:text-slate-500 font-bold">
              For Partners
            </span>
            <div className="grid grid-flow-row gap-1 auto-rows-max">
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/blog"
              >
                Partner with us
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/academy"
              >
                Token list enquiry
              </a>
            </div>
          </div>
          <div className="px-3 pb-4">
            <span className="flex h-[42px] items-center px-2 uppercase text-xs  text-gray-400 dark:text-slate-500 font-bold">
              For Developers
            </span>
            <div className="grid grid-flow-row gap-1 auto-rows-max">
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/blog"
              >
                GitBook
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/academy"
              >
                GitHub
              </a>
              <a
                className="h-[42px] font-medium text-base tracking-tight hover:bg-secondary my-px group flex w-full items-center rounded-lg border border-transparent px-2 py-2 "
                href="/academy"
              >
                Brand kit
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        data-state={showMore ? 'open' : 'closed'}
        onClick={() => setShowMore(false)}
        role="button"
        className="cursor-default z-[1090] backdrop-blur data-[state=open]:fixed data-[state=closed]:hidden transition-all left-[440px] bg-black/[0.04] top-0 bottom-0 right-0"
      />
    </div>
  )
}
