import { z } from 'zod'
import { isSushiSwapV2ChainId, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { useRouter } from 'next/router'
import { usePool } from '@sushiswap/client'
import { useSWRConfig } from 'swr'
import { useAccount } from '@sushiswap/wagmi'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import React, { useMemo } from 'react'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { formatPercent } from '@sushiswap/format'
import { Layout, PoolPositionProvider, PoolPositionRewardsProvider, PoolPositionStakedProvider } from '../../components'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { unwrapToken } from '../../lib/functions'
import { ChainId } from '@sushiswap/chain'
import { MigrateTab } from '../../components/PoolPage/MigrateTab'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { ConcentratedLiquidityProvider } from '../../components/ConcentratedLiquidityProvider'
import { Token } from '@sushiswap/currency'
import { SettingsModule, SettingsOverlay } from '@sushiswap/ui/future/components/settings'
import { Button } from '@sushiswap/ui/future/components/button'
import { CogIcon } from '@heroicons/react/outline'

const queryParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => val.includes(':'), {
      message: 'PoolId not in the right format',
    })
    .transform((val) => {
      const [chainId, poolId] = val.split(':')
      return [+chainId, poolId] as [SushiSwapV2ChainId, string]
    })
    .refine(([chainId]) => isSushiSwapV2ChainId(chainId), {
      message: 'ChainId not supported.',
    }),
})

const MigratePositionPage = () => {
  const router = useRouter()
  return (
    <SplashController show={!router.isReady}>
      <Migrate />
    </SplashController>
  )
}

export const Migrate = () => {
  const { address } = useAccount()
  const { query } = useRouter()

  const {
    id: [chainId, poolId],
  } = queryParamsSchema.parse(query)

  const { data: pool, isLoading } = usePool({
    args: { chainId, address: poolId },
    swrConfig: useSWRConfig(),
    shouldFetch: Boolean(chainId && address),
  })

  const [token0, token1] = useMemo(() => {
    if (!pool) return [undefined, undefined]

    const _token0 = new Token({
      address: pool.token0.address,
      name: pool.token0.name,
      decimals: Number(pool.token0.decimals),
      symbol: pool.token0.symbol,
      chainId: pool.chainId,
    })

    const _token1 = new Token({
      address: pool.token1.address,
      name: pool.token1.name,
      decimals: Number(pool.token1.decimals),
      symbol: pool.token1.symbol,
      chainId: pool.chainId,
    })

    return [_token0, _token1]
  }, [pool])

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <Link className="flex items-center gap-4 mb-2 group" href={'/'} shallow={true}>
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
            Go back to pool list
          </span>
        </Link>

        {isLoading ? (
          <div className="flex gap-6 h-[52px]">
            <div className="inline-flex">
              <Skeleton.Circle radius={48} />
              <Skeleton.Circle radius={48} style={{ marginLeft: -48 / 3 }} />
            </div>
            <div className="flex flex-col flex-grow">
              <Skeleton.Text fontSize="text-xl" className="w-[120px]" />
              <Skeleton.Text fontSize="text-base" className="w-[240px]" />
            </div>
          </div>
        ) : pool && token0 && token1 ? (
          <div className="flex gap-6 h-[52px]">
            <div className="flex min-w-[44px]">
              <Badge
                className="border-2 border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
                position="bottom-right"
                badgeContent={<NetworkIcon chainId={pool.chainId as ChainId} width={24} height={24} />}
              >
                <Currency.IconList iconWidth={48} iconHeight={48}>
                  <Currency.Icon currency={unwrapToken(token0)} />
                  <Currency.Icon currency={unwrapToken(token1)} />
                </Currency.IconList>
              </Badge>
            </div>
            <div className="flex flex-col flex-grow gap-0.5">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
                Migrate {unwrapToken(token0).symbol}/{unwrapToken(token1).symbol}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                SushiSwap V2 <span className="text-[10px]">•</span> {formatPercent(pool.swapFee)}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: 'migrateLiquidity',
                defaultValue: '0.5',
                title: 'Migrate Liquidity Slippage',
              },
            }}
            modules={[SettingsModule.CustomTokens, SettingsModule.SlippageTolerance]}
          >
            {({ setOpen }) => (
              <Button variant="outlined" color="default" onClick={() => setOpen(true)}>
                <CogIcon width={24} height={24} />
              </Button>
            )}
          </SettingsOverlay>
        </div>
      </div>
      <div className="w-full bg-gray-900/5 dark:bg-slate-200/5 my-5 md:my-10 h-0.5" />
      <div className="mt-10 grid md:grid-cols-[auto_404px] gap-10">
        {isLoading ? (
          <>
            <div>
              <Skeleton.Box className="h-[164px]" />
            </div>
            <div className="flex flex-col gap-[64px]">
              <div className="flex flex-col gap-6">
                <Skeleton.Text fontSize="text-xl" className="w-[240px]" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton.Box className="h-[76px]" />
                  <Skeleton.Box className="h-[76px]" />
                  <Skeleton.Box className="h-[76px]" />
                  <Skeleton.Box className="h-[76px]" />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <Skeleton.Text fontSize="text-xl" className="w-[240px]" />
                <Skeleton.Box className="h-[266px]" />
                <Skeleton.Box className="h-[52px]" />
              </div>
            </div>
          </>
        ) : pool ? (
          <PoolPositionProvider pool={pool}>
            <PoolPositionStakedProvider pool={pool}>
              <PoolPositionRewardsProvider pool={pool}>
                <ConcentratedLiquidityProvider>
                  <MigrateTab pool={pool} />
                </ConcentratedLiquidityProvider>
              </PoolPositionRewardsProvider>
            </PoolPositionStakedProvider>
          </PoolPositionProvider>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  )
}

export default MigratePositionPage
