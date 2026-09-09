'use client'

import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { LaunchpadTokenEdge } from '@sushiswap/graph-client/data-api'
import { Currency, LinkInternal, SkeletonBox, classNames } from '@sushiswap/ui'
import { type ComponentProps, type ReactElement, useMemo } from 'react'
import { EvmToken, getEvmChainById } from 'sushi/evm'
import {
  formatPercent,
  formatUsd,
  volumeChangePercent,
} from '../../_lib/format'

function TrendingTokenCardFrame({
  className,
  ...props
}: ComponentProps<'div'>): ReactElement {
  return (
    <div
      {...props}
      className={classNames(
        'flex min-h-[130px] w-full min-w-0 shrink-0 items-center gap-4 rounded-2xl bg-white/[0.03] p-4 lg:min-h-[224px] lg:w-[440px] lg:border lg:border-white/[0.12]',
        className,
      )}
    />
  )
}

export function TrendingTokenCard({
  token,
  isStockPair,
}: {
  token: LaunchpadTokenEdge
  isStockPair: boolean
}): ReactElement {
  const chain = getEvmChainById(token.node.chainId)
  const chainKey = chain.key

  const [baseToken, quoteToken] = useMemo(() => {
    const _baseToken = token.node
    const base = new EvmToken({
      chainId: _baseToken.chainId,
      address: _baseToken.address,
      decimals: _baseToken.decimals,
      symbol: _baseToken.symbol,
      name: _baseToken.name,
    })
    const _quoteToken = token.node.pool.quoteToken
    const quote = new EvmToken({
      chainId: token.node.chainId,
      address: _quoteToken.address,
      decimals: _quoteToken.decimals,
      symbol: _quoteToken.symbol,
      name: _quoteToken.name,
    })
    return [base, quote]
  }, [token])

  const volPctChange = volumeChangePercent(
    token.node.metrics?.volumeUsd.h12,
    token.node.metrics?.volumeUsd.h24,
  )

  return (
    <LinkInternal
      className="block w-full min-w-0 shrink-0 lg:w-[440px]"
      href={`/${chainKey}/launchpad/token/${token.node.address}`}
    >
      <TrendingTokenCardFrame className="hover:bg-white/[0.06] transition-colors">
        <div className="flex flex-col gap-2 w-full lg:hidden">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="rounded-full border-2 border-white">
                <Currency.Icon currency={baseToken} width={48} height={48} />
              </div>
              <div className="flex flex-col gap-1 ml-4">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-bold max-w-[120px] xs:max-w-[140px] sm:max-w-full truncate">
                    {baseToken.name}
                  </div>
                  <div className="text-sm text-perps-muted-50 max-w-[50px] xs:max-w-[65px] sm:max-w-full truncate">
                    {baseToken.symbol}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280] text-xs">
                  <div>Paired with</div>
                  <Currency.Icon currency={quoteToken} width={14} height={14} />
                  <p className="font-medium">{quoteToken.symbol}</p>
                </div>
              </div>
            </div>
            <ArrowRightIcon width={18} height={18} className="min-w-[18px]" />
          </div>
          <hr className="w-full border-[1px] border-white/[0.06]" />
          <div className="flex items-center justify-between w-full">
            <div className="font-bold text-white text-lg">
              {formatUsd(token.node.metrics?.marketCapitalizationUsd)}
              <div className="inline-block ml-1 text-[#6B7280] text-xs">
                Marketcap
              </div>
            </div>
            <div
              title="12h volume change compared with the previous 12 hours"
              className={classNames(
                'text-sm font-bold',
                volPctChange == null
                  ? 'text-perps-muted-50'
                  : volPctChange >= 0
                    ? 'text-perps-green'
                    : 'text-perps-red',
              )}
            >
              {formatPercent(volPctChange)}
            </div>
          </div>
        </div>
        <div className="hidden w-full items-center gap-4 lg:flex">
          <div className="shrink-0 rounded-full border-[10px] border-white/[0.06]">
            <div className="rounded-full relative border-[10px] border-white/[0.16]">
              <Currency.Icon currency={baseToken} width={150} height={150} />
              <div className="absolute top-0 left-0 w-full h-full border-[5px] border-white/[0.56] rounded-full" />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div>
              <div className="truncate text-xl font-bold">{baseToken.name}</div>
              <div className="truncate text-sm text-perps-muted-50">
                {baseToken.symbol}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-white text-2xl">
                {formatUsd(token.node.metrics?.marketCapitalizationUsd)}
              </div>
              <div
                title="12h volume change compared with the previous 12 hours"
                className={classNames(
                  'text-sm font-bold',
                  volPctChange == null
                    ? 'text-perps-muted-50'
                    : volPctChange >= 0
                      ? 'text-perps-green'
                      : 'text-perps-red',
                )}
              >
                {formatPercent(volPctChange)}
              </div>
            </div>
            <div className="flex items-center gap-2 text-perps-muted-50 text-sm">
              <div className="flex items-center gap-1">
                <Currency.Icon currency={quoteToken} width={14} height={14} />
                <p>{quoteToken.symbol}</p>
              </div>
              {isStockPair ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-[#00A3EF]">STOCK PAIR</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </TrendingTokenCardFrame>
    </LinkInternal>
  )
}

export function TrendingTokenCardSkeleton(): ReactElement {
  return (
    <TrendingTokenCardFrame role="status" aria-label="Loading trending token">
      <span className="sr-only">Loading trending token</span>
      <div
        aria-hidden="true"
        className="hidden w-full items-center gap-4 lg:flex"
      >
        <div className="shrink-0 rounded-full border-[10px] border-white/[0.06]">
          <div className="relative rounded-full border-[10px] border-white/[0.16]">
            <SkeletonBox className="h-[150px] w-[150px] !rounded-full motion-reduce:animate-none" />
            <div className="absolute inset-0 rounded-full border-[5px] border-white/[0.56]" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <div className="flex h-7 items-center">
              <SkeletonBox className="h-5 w-32 max-w-full motion-reduce:animate-none" />
            </div>
            <div className="flex h-5 items-center">
              <SkeletonBox className="h-3 w-20 motion-reduce:animate-none" />
            </div>
          </div>
          <div>
            <div className="flex h-8 items-center">
              <SkeletonBox className="h-6 w-28 motion-reduce:animate-none" />
            </div>
            <div className="flex h-5 items-center">
              <SkeletonBox className="h-3 w-16 motion-reduce:animate-none" />
            </div>
          </div>
          <div className="flex h-5 items-center gap-1">
            <SkeletonBox className="h-3.5 w-3.5 !rounded-full motion-reduce:animate-none" />
            <SkeletonBox className="h-3 w-16 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="flex w-full min-w-0 flex-col gap-2 lg:hidden"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center">
            <div className="shrink-0 rounded-full border-2 border-white">
              <SkeletonBox className="h-12 w-12 !rounded-full motion-reduce:animate-none" />
            </div>
            <div className="ml-4 flex min-w-0 flex-col gap-1">
              <div className="flex h-7 items-center gap-2">
                <SkeletonBox className="h-5 w-24 max-w-full motion-reduce:animate-none" />
                <SkeletonBox className="h-3 w-10 motion-reduce:animate-none" />
              </div>
              <div className="flex h-4 items-center gap-1">
                <SkeletonBox className="h-3 w-14 motion-reduce:animate-none" />
                <SkeletonBox className="h-3.5 w-3.5 !rounded-full motion-reduce:animate-none" />
                <SkeletonBox className="h-3 w-8 motion-reduce:animate-none" />
              </div>
            </div>
          </div>
          <SkeletonBox className="h-[18px] w-[18px] shrink-0 motion-reduce:animate-none" />
        </div>
        <hr className="w-full border-[1px] border-white/[0.06]" />
        <div className="flex h-7 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <SkeletonBox className="h-5 w-20 motion-reduce:animate-none" />
            <SkeletonBox className="h-3 w-14 motion-reduce:animate-none" />
          </div>
          <SkeletonBox className="h-3 w-14 motion-reduce:animate-none" />
        </div>
      </div>
    </TrendingTokenCardFrame>
  )
}
