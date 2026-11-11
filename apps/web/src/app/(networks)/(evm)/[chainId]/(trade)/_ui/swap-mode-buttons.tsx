'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { PathnameButton } from 'src/app/_ui/pathname-button'
import { isLifiXSwapSupportedChainId, isSupportedChainId } from 'src/config'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { isTwapSupportedChainId } from 'src/lib/swap/twap/supported-chain-ids'
import { type ChainId, getChainById } from 'sushi'
import { isStellarChainId } from 'sushi/stellar'

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
  active,
  children,
  className,
  fullWidth = false,
}: {
  isSupported: boolean
  path: string
  active?: boolean
  children: ReactNode
  className?: string
  fullWidth?: boolean
}) => {
  const widthClassName = fullWidth ? 'w-full' : 'w-auto'
  const activeClassName = active ? '!bg-background' : '!bg-muted'

  if (isSupported) {
    return (
      <Link href={path} className={classNames('block', widthClassName)}>
        <PathnameButton
          pathname={path}
          active={active}
          size="default"
          className={classNames(
            widthClassName,
            'justify-start',
            activeClassName,
            className,
          )}
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
          active={active}
          size="default"
          disabled
          className={classNames(
            'cursor-not-allowed justify-start',
            widthClassName,
            activeClassName,
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
  activePathname,
}: { chainId?: number; activePathname?: string }) => {
  const { chainId: paramsChainId } = useParams<{ chainId?: string }>()
  const chainId = chainIdProp ?? Number(paramsChainId)
  const detectedPathname = usePathname()
  const pathname = activePathname ?? detectedPathname

  if (!isSwapModeChainId(chainId)) {
    return null
  }

  // const supportsCrossChain =
  //   isLifiXSwapSupportedChainId(chainId) || isNearIntentsChainId(chainId)
  const twapSupported = isTwapSupportedChainId(chainId)
  const chain = getChainById(chainId)
  const basePath = `/${chain.key}`

  function getActiveState(path: string): boolean | undefined {
    return activePathname === undefined
      ? undefined
      : activePathname === path || activePathname === path.replace('%3A', ':')
  }

  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="font-semibold text-lg sm:text-2xl whitespace-nowrap">
        Trade <span className="hidden sm:inline">tokens</span>
      </h2>

      <div className="flex gap-1 flex-wrap">
        <SwapModeButton
          isSupported={isSupportedChainId(chainId) || isStellarChainId(chainId)}
          path={`${basePath}/swap`}
          active={getActiveState(`${basePath}/swap`)}
        >
          Swap
        </SwapModeButton>

        <HoverCard openDelay={150} closeDelay={100}>
          <HoverCardTrigger asChild>
            {twapSupported ? (
              <Button
                size="default"
                variant={'secondary'}
                className={classNames(
                  'flex items-center gap-1',
                  isAdvancedPath(pathname) ? '!bg-background' : '!bg-muted',
                )}
              >
                {getAdvancedTriggerLabel(pathname)}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            ) : (
              <span className="inline-flex">
                <Button
                  size="default"
                  variant={'secondary'}
                  disabled
                  className={classNames(
                    'flex items-center gap-1',
                    isAdvancedPath(pathname) ? '!bg-background' : '!bg-muted',
                  )}
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
                  active={getActiveState(`${basePath}/limit`)}
                  className={classNames(
                    getActiveState(`${basePath}/limit`)
                      ? ''
                      : '!bg-transparent hover:!bg-muted',
                  )}
                  fullWidth
                >
                  Limit
                </SwapModeButton>
                <SwapModeButton
                  isSupported={twapSupported}
                  path={`${basePath}/dca`}
                  active={getActiveState(`${basePath}/dca`)}
                  className={classNames(
                    getActiveState(`${basePath}/dca`)
                      ? ''
                      : '!bg-transparent hover:!bg-muted',
                  )}
                  fullWidth
                >
                  DCA
                </SwapModeButton>
                <SwapModeButton
                  isSupported={twapSupported}
                  path={`${basePath}/stop-loss`}
                  active={getActiveState(`${basePath}/stop-loss`)}
                  className={classNames(
                    getActiveState(`${basePath}/stop-loss`)
                      ? ''
                      : '!bg-transparent hover:!bg-muted',
                  )}
                  fullWidth
                >
                  Stop Loss
                </SwapModeButton>
                <SwapModeButton
                  isSupported={twapSupported}
                  path={`${basePath}/take-profit`}
                  active={getActiveState(`${basePath}/take-profit`)}
                  className={classNames(
                    getActiveState(`${basePath}/take-profit`)
                      ? ''
                      : '!bg-transparent hover:!bg-muted',
                  )}
                  fullWidth
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

        {/* <HoverCard>
          <SwapModeButton
            isSupported={supportsCrossChain}
            path={`${basePath}/cross-chain-swap`}
            active={getActiveState(`${basePath}/cross-chain-swap`)}
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
        </HoverCard> */}
      </div>
    </div>
  )
}
