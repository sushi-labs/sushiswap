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
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  typographyVariants,
} from '@sushiswap/ui'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { formatPercent } from 'sushi'
import {
  KvmChainId,
  KvmToken,
  type KvmTokenAddress,
  getKvmChainByKey,
} from 'sushi/kvm'
import {
  KADENA_CHAIN_ID,
  KADENA_NETWORK_ID,
} from '~kadena/_common/constants/network'
import { useBaseTokens } from '~kadena/_common/lib/hooks/use-base-tokens'
import { usePoolById } from '~kadena/_common/lib/hooks/use-pool-by-id'
import { useTokenPrecision } from '~kadena/_common/lib/hooks/use-token-precision'
import { Icon } from '~kadena/_common/ui/General/Icon'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'
import { APRHoverCard } from './apr-hover-card'

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
    tokenContract: (pool?.token0?.address as KvmTokenAddress) ?? undefined,
  })
  const { data: decimals1 } = useTokenPrecision({
    tokenContract: (pool?.token1?.address as KvmTokenAddress) ?? undefined,
  })

  const isLoading = isLoadingPoolById || isLoadingPool

  useEffect(() => {
    if (pool?.token0) {
      const _token0 = baseTokens?.find(
        (token) => token.address === pool.token0.address,
      )
      if (_token0) {
        setToken0(_token0)
        return
      }
      setToken0(
        new KvmToken({
          chainId: KvmChainId.KADENA,
          address: pool?.token0?.address as KvmTokenAddress,
          symbol: pool?.token0?.name.slice(0, 4)?.toUpperCase(),
          decimals: decimals0 || 12,
          name: pool.token0.name,
          metadata: {
            imageUrl: undefined,
            validated: false,
            kadenaChainId: KADENA_CHAIN_ID,
            kadenaNetworkId: KADENA_NETWORK_ID,
          },
        }),
      )
    }
  }, [pool?.token0, setToken0, baseTokens, decimals0])

  useEffect(() => {
    if (pool?.token1) {
      const _token1 = baseTokens?.find(
        (token) => token.address === pool.token1.address,
      )
      if (_token1) {
        setToken1(_token1)
        return
      }
      setToken1(
        new KvmToken({
          chainId: KvmChainId.KADENA,
          address: pool?.token1?.address as KvmTokenAddress,
          symbol: pool?.token1?.name.slice(0, 4)?.toUpperCase(),
          decimals: decimals1 || 12,
          name: pool.token1.name,
          metadata: {
            imageUrl: undefined,
            validated: false,
            kadenaChainId: KADENA_CHAIN_ID,
            kadenaNetworkId: KADENA_NETWORK_ID,
          },
        }),
      )
    }
  }, [pool?.token1, setToken1, baseTokens, decimals1])

  return (
    <div className="flex flex-col gap-6 w-full">
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
        <div className="flex flex-wrap justify-between gap-6">
          {isLoading ? (
            <div className="flex items-center w-full gap-3">
              <div className="flex items-center">
                <SkeletonCircle radius={36} />
                <SkeletonCircle radius={36} className="-ml-[13.33px]" />
              </div>
              <div className="w-[200px]">
                <SkeletonBox className="w-full h-[40px]" />
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
                    'sm:!text-4xl !font-bold text-gray-900 dark:text-slate-50 truncate overflow-x-auto',
                })}
              >
                <LinkExternal
                  href={getKvmChainByKey('kadena').getAccountUrl(
                    poolAddress ?? '',
                  )}
                >
                  {token0?.symbol}/{token1?.symbol}
                </LinkExternal>
              </Button>
            </div>
          )}
          {pathname.includes('add') ? null : (
            <div className="flex items-center gap-2">
              <LinkInternal shallow={true} href={`/kadena/pool/${poolId}/add`}>
                <Button asChild>Add Liquidity</Button>
              </LinkInternal>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-y-5 gap-x-[32px] text-secondary-foreground mb-8 mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold tracking-tighter">APR</span>
          <APRHoverCard apr24h={pool?.apr24h ?? 0}>
            <div className="underline decoration-dotted underline-offset-2">
              {formatPercent(Number(pool?.apr24h ?? 0) / 100)}
            </div>
          </APRHoverCard>
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
            <div className="w-32">
              <SkeletonText />
            </div>
            <div className="w-32">
              <SkeletonText />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tighter">
                {token0?.symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getKvmChainByKey('kadena').getTokenUrl(
                  token0?.address ?? '',
                )}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token0?.name}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tighter">
                {token1?.symbol}
              </span>
              <LinkExternal
                target="_blank"
                href={getKvmChainByKey('kadena').getTokenUrl(
                  token1?.address ?? '',
                )}
              >
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="!font-medium !text-secondary-foreground"
                >
                  {`${token1?.name}`}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </Button>
              </LinkExternal>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
