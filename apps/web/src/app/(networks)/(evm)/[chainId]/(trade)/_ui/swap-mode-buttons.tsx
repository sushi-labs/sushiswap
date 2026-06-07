'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { isLifiXSwapSupportedChainId, isSupportedChainId } from 'src/config'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { type ChainId, getChainById } from 'sushi'
import { isStellarChainId } from 'sushi/stellar'
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
  if (isSupported) {
    return (
      <Link href={path} className="block w-full">
        <PathnameButton
          pathname={path}
          size="sm"
          className={classNames('w-full justify-start', className)}
        >
          {children}
        </PathnameButton>
      </Link>
    )
  }

  return (
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

function isSwapModeChainId(chainId: number): chainId is ChainId {
  return (
    isSupportedChainId(chainId) ||
    isStellarChainId(chainId) ||
    isLifiXSwapSupportedChainId(chainId) ||
    isNearIntentsChainId(chainId)
  )
}

export const SwapModeButtons = ({
  chainId: chainIdProp,
}: { chainId?: number }) => {
  const { chainId: paramsChainId } = useParams<{ chainId?: string }>()
  const chainId = chainIdProp ?? Number(paramsChainId)
  const pathname = usePathname()

  if (!isSwapModeChainId(chainId)) {
    return null
  }

  const supportsCrossChain =
    isLifiXSwapSupportedChainId(chainId) || isNearIntentsChainId(chainId)
  const twapSupported = isTwapSupportedChainId(chainId)
  const chain = getChainById(chainId)
  const basePath = `/${chain.key}`

  return (
    <div className="flex gap-1 md:gap-2 flex-wrap">
      <SwapModeButton
        isSupported={isSupportedChainId(chainId) || isStellarChainId(chainId)}
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
          isSupported={supportsCrossChain}
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
        {supportsCrossChain ? (
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
