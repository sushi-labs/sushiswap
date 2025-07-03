'use client'

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Currency,
  LinkExternal,
  LinkInternal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonCircle,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { formatPercent } from 'sushi/format'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { useTokenPrecision } from '~kadena/_common/lib/hooks/use-token-precision'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { Icon } from '~kadena/_common/ui/General/Icon'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'

export const PoolHeader = ({ poolId }: { poolId: string }) => {
  const router = useRouter()
  const pathname = usePathname()

  const { data: baseTokens } = useBaseTokens()

  const { data: pool, isLoading: isLoadingPoolById } = usePoolById({
    poolId,
    first: 1,
  })
  const { setToken0, setToken1 } = usePoolDispatch()
  const { token0, token1, poolId: poolAddress, isLoadingPool } = usePoolState()
  const { data: decimals0 } = useTokenPrecision({
    tokenContract: pool?.token0?.address ?? '',
  })
  const { data: decimals1 } = useTokenPrecision({
    tokenContract: pool?.token1?.address ?? '',
  })

  const isLoading = isLoadingPoolById || isLoadingPool

  useEffect(() => {
    if (pool?.token0) {
      const _token0 = baseTokens?.find(
        (token) => token.tokenAddress === pool.token0.address,
      )
      setToken0({
        tokenAddress: pool?.token0?.address,
        tokenSymbol:
          _token0?.tokenSymbol ?? pool?.token0?.name.slice(0, 4)?.toUpperCase(),
        tokenDecimals: _token0?.tokenDecimals || decimals0 || 12,
        tokenName: _token0?.tokenName ?? pool.token0.name,
        tokenImage: _token0?.tokenImage ?? '',
      })
    }
    if (pool?.token1) {
      const _token1 = baseTokens?.find(
        (token) => token.tokenAddress === pool.token1.address,
      )
      setToken1({
        tokenAddress: pool?.token1?.address,
        tokenSymbol:
          _token1?.tokenSymbol ?? pool?.token1?.name.slice(0, 4)?.toUpperCase(),
        tokenDecimals: _token1?.tokenDecimals || decimals1 || 12,
        tokenName: _token1?.tokenName ?? pool.token1.name,
        tokenImage: _token1?.tokenImage ?? '',
      })
    }
  }, [
    pool?.token0,
    pool?.token1,
    setToken0,
    setToken1,
    baseTokens,
    decimals0,
    decimals1,
  ])

  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <button
            className="text-sm text-blue hover:underline w-fit"
            type="button"
            onClick={() => {
              router.back()
            }}
          >
            ← Back
          </button>
          {isLoading ? (
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center">
                <SkeletonCircle radius={40} />
                <SkeletonCircle radius={40} className="-ml-[13.33px]" />
              </div>
              <div className="w-[200px]">
                <SkeletonText fontSize="3xl" />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center gap-3 max-w-[100vh]">
              <Currency.IconList iconWidth={36} iconHeight={36}>
                <Icon currency={token0} />
                <Icon currency={token1} />
              </Currency.IconList>
              <Button
                asChild
                variant="link"
                className={typographyVariants({
                  variant: 'h1',
                  className:
                    'sm:!text2-xl sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
                })}
              >
                <LinkExternal href={getChainwebAddressLink(poolAddress ?? '')}>
                  {token0?.tokenSymbol}/{token1?.tokenSymbol}
                </LinkExternal>
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">APR</span>
            <Popover>
              <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
                <div className="underline border-dotted cursor-pointer">
                  {formatPercent(Number(pool?.apr24h ?? 0) / 100)}
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                className="max-w-[320px] whitespace-normal text-left"
              >
                <span className="text-xs">
                  APR is calculated based on the fees generated by the pool over
                  the last 24 hours. The APR displayed is algorithmic and
                  subject to change.
                </span>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">Fee</span>
            0.3%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-tighter">Network</span>
            Kadena
          </div>
          {isLoading ? (
            <>
              <div className="w-48">
                <SkeletonText />
              </div>
              <div className="w-48">
                <SkeletonText />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold tracking-tighter">
                  {token0?.tokenSymbol}
                </span>
                <LinkExternal
                  target="_blank"
                  href={getChainwebAddressLink(token0?.tokenAddress ?? '')}
                >
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="!font-medium !text-secondary-foreground"
                  >
                    {`${token0?.tokenName}`}
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                  </Button>
                </LinkExternal>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold tracking-tighter">
                  {token1?.tokenSymbol}
                </span>
                <LinkExternal
                  target="_blank"
                  href={getChainwebAddressLink(token1?.tokenAddress ?? '')}
                >
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="!font-medium !text-secondary-foreground"
                  >
                    {`${token1?.tokenName}`}
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                  </Button>
                </LinkExternal>
              </div>
            </>
          )}
        </div>
      </div>
      {pathname.includes('add') ? null : (
        <div className="flex items-center gap-2">
          <LinkInternal shallow={true} href={`/kadena/pool/${poolId}/add`}>
            <Button asChild>Add Liquidity</Button>
          </LinkInternal>
        </div>
      )}
    </div>
  )
}
