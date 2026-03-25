'use client'

import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  classNames,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { isSupportedChainId, isXSwapSupportedChainId } from 'src/config'
import { type ChainId, getChainById } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { isTwapSupportedChainId } from '../(orbs)/_ui/helper'

const ADVANCED_SEGMENTS = ['limit', 'dca', 'stop-loss', 'take-profit'] as const

const ADVANCED_LABELS: Record<(typeof ADVANCED_SEGMENTS)[number], string> = {
  limit: 'Limit',
  dca: 'DCA',
  'stop-loss': 'Stop Loss',
  'take-profit': 'Take Profit',
}

function isAdvancedPath(pathname: string): boolean {
  return ADVANCED_SEGMENTS.some((seg) => pathname.includes(`/${seg}`))
}

function getAdvancedTriggerLabel(pathname: string): string {
  for (const seg of ADVANCED_SEGMENTS) {
    if (pathname.includes(`/${seg}`)) return ADVANCED_LABELS[seg]
  }
  return 'Advanced'
}

const SwapModeButton = ({
  isSupported,
  path,
  children,
  className,
}: {
  isSupported: boolean
  path: string
  children: ReactNode
  className?: string
}) => {
  const buttonClass = classNames('w-full justify-start', className)
  return isSupported ? (
    <Link href={path} className="block w-full">
      <PathnameButton pathname={path} size="sm" className={buttonClass}>
        {children}
      </PathnameButton>
    </Link>
  ) : (
    <HoverCard>
      <HoverCardTrigger asChild>
        <PathnameButton
          pathname={path}
          size="sm"
          disabled
          className={classNames(
            'cursor-not-allowed w-full justify-start',
            className,
          )}
        >
          {children}
        </PathnameButton>
      </HoverCardTrigger>
      <HoverCardContent className="!px-3 !py-1.5 text-xs">
        Not supported on this network
      </HoverCardContent>
    </HoverCard>
  )
}

export const SwapModeButtons = () => {
  const { chainId: _chainId } = useParams()
  const chainId = +_chainId!
  const pathname = usePathname()
  const chainKey = getChainById(chainId as ChainId).key
  const basePath = `/${chainKey}`

  if (!isEvmChainId(chainId) && !isSvmChainId(chainId)) {
    return null
  }

  const twapSupported = isTwapSupportedChainId(chainId)

  return (
    <div className="flex gap-1">
      <SwapModeButton
        isSupported={isSupportedChainId(chainId)}
        path={`${basePath}/swap`}
      >
        Swap
      </SwapModeButton>

      <HoverCard openDelay={150} closeDelay={100}>
        <HoverCardTrigger asChild>
          {twapSupported ? (
            <Button
              size="sm"
              variant={isAdvancedPath(pathname) ? 'secondary' : 'ghost'}
              className="flex items-center gap-1"
            >
              {getAdvancedTriggerLabel(pathname)}
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          ) : (
            <span className="inline-flex">
              <Button
                size="sm"
                variant={isAdvancedPath(pathname) ? 'secondary' : 'ghost'}
                disabled
                className="flex items-center gap-1"
              >
                {getAdvancedTriggerLabel(pathname)}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </span>
          )}
        </HoverCardTrigger>
        {twapSupported ? (
          <HoverCardContent
            sideOffset={4}
            className="!p-2 text-left"
            align="start"
          >
            <div className="flex flex-col gap-0.5">
              <SwapModeButton
                isSupported={twapSupported}
                path={`${basePath}/limit`}
                className="justify-start"
              >
                Limit
              </SwapModeButton>
              <SwapModeButton
                isSupported={twapSupported}
                path={`${basePath}/dca`}
              >
                DCA
              </SwapModeButton>
              <SwapModeButton
                isSupported={twapSupported}
                path={`${basePath}/stop-loss`}
              >
                Stop Loss
              </SwapModeButton>
              <SwapModeButton
                isSupported={twapSupported}
                path={`${basePath}/take-profit`}
              >
                Take Profit
              </SwapModeButton>
            </div>
          </HoverCardContent>
        ) : (
          <HoverCardContent className="!px-3 !py-1.5 text-xs">
            Not supported on this network
          </HoverCardContent>
        )}
      </HoverCard>

      <HoverCard>
        <SwapModeButton
          isSupported={isXSwapSupportedChainId(chainId)}
          path={`${basePath}/cross-chain-swap`}
        >
          <HoverCardTrigger asChild>
            <span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
              <ShuffleIcon
                width={20}
                height={20}
                className="text-blue hidden md:block"
              />
              Cross-Chain
            </span>
          </HoverCardTrigger>
        </SwapModeButton>
        {isXSwapSupportedChainId(chainId) ? (
          <HoverCardContent className="!p-0 max-w-[320px]">
            <CardHeader>
              <CardTitle>Cross-Chain Swap</CardTitle>
              <CardDescription>
                Swap tokens natively across 15 chains including Ethereum,
                Arbitrum, Optimism, Polygon, Base and more!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                target="_blank"
                className="text-sm text-blue hover:underline"
                href="https://www.sushi.com/blog/sushixswap-v2"
                rel="noreferrer"
              >
                Learn more.
              </a>
            </CardContent>
          </HoverCardContent>
        ) : null}
      </HoverCard>
    </div>
  )
}
