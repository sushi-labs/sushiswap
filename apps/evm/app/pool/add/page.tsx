'use client'

import { ArrowLeftIcon, SwitchHorizontalIcon } from '@heroicons/react-v1/solid'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { typographyVariants } from '@sushiswap/ui'
import { Separator } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/components/Badge'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonText } from '@sushiswap/ui/components/skeleton'
import { SplashController } from '@sushiswap/ui/components/SplashController'
import { computePoolAddress } from '@sushiswap/v3-sdk'
import { useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPool, useConcentratedPositionInfo } from '@sushiswap/wagmi/future/hooks'
import { getV3FactoryContractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3FactoryContract'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useTokenAmountDollarValues } from 'lib/hooks'
import Link from 'next/link'
import React, { FC, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'
import { Layout, SelectNetworkWidget, SelectPricesWidget, SelectTokensWidget } from 'ui/pool'
import { ContentBlock } from 'ui/pool/AddPage/ContentBlock'
import { ConcentratedLiquidityProvider } from 'ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from 'ui/pool/ConcentratedLiquidityURLStateProvider'
import { ConcentratedLiquidityWidget } from 'ui/pool/ConcentratedLiquidityWidget'
import { SelectFeeConcentratedWidget } from 'ui/pool/NewPositionSection/SelectFeeConcentratedWidget'

export default function Page() {
  return (
    <ConcentratedLiquidityURLStateProvider>
      {({ token0, chainId }) => (
        <SplashController show={Boolean(!token0 || !chainId)}>
          <SWRConfig>
            <Layout>
              <div className="flex flex-col gap-2">
                <Link className="flex items-center gap-4 mb-2 group" href={'/pool'} shallow={true}>
                  <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
                  <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                    Go back to pools list
                  </span>
                </Link>
                <h1 className={typographyVariants({ variant: 'h3' })}>Add Liquidity</h1>
                <p className={typographyVariants({ variant: 'muted' })}>
                  Create a new pool or create a liquidity position on an existing pool.
                </p>
              </div>
              <Separator orientation="horizontal" className="mt-4 mb-10" />
              <div className="flex justify-center">
                <div className="flex lg:grid lg:grid-cols-[404px_auto] gap-20">
                  <ConcentratedLiquidityProvider>
                    <_Add />
                  </ConcentratedLiquidityProvider>
                </div>
              </div>
            </Layout>
          </SWRConfig>
        </SplashController>
      )}
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _Add: FC = () => {
  const { address } = useAccount()
  const {
    chainId,
    token0,
    token1,
    setToken1,
    setToken0,
    setNetwork,
    feeAmount,
    setFeeAmount,
    tokensLoading,
    tokenId,
    switchTokens,
  } = useConcentratedLiquidityURLState()

  const [invert, setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computePoolAddress({
            factoryAddress: getV3FactoryContractConfig(chainId).address,
            tokenA: token0.wrapped,
            tokenB: token1.wrapped,
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1]
  )

  const { data: pool, isInitialLoading } = useConcentratedLiquidityPool({ chainId, token0, token1, feeAmount })

  const fiatAmounts = useMemo(() => [tryParseAmount('1', token0), tryParseAmount('1', token1)], [token0, token1])
  const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId, amounts: fiatAmounts })

  return (
    <>
      <div className="hidden lg:block">
        <div className="lg:grid grid-cols-2 items-center gap-6 sticky top-[96px]">
          <div className="flex col-span-2 gap-7">
            <div className="flex min-w-[44px] mb-4">
              <Badge
                className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
                position="bottom-right"
                badgeContent={
                  chainId ? (
                    <NetworkIcon chainId={chainId} width={24} height={24} />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                  )
                }
              >
                <Currency.IconList iconWidth={48} iconHeight={48}>
                  {token0 && !tokensLoading ? (
                    <Currency.Icon currency={token0} />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />
                  )}
                  {token1 && !tokensLoading ? (
                    <Currency.Icon currency={token1} />
                  ) : (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />
                  )}
                </Currency.IconList>
              </Badge>
            </div>
            <div className="flex flex-col flex-grow">
              {token0 && token1 ? (
                <>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
                    {token0.symbol}/{token1.symbol}
                  </h1>
                  <p className="font-medium text-gray-700 dark:dark:text-slate-400 text-slate-600">
                    SushiSwap V3 • {feeAmount / 10000}%
                  </p>
                </>
              ) : tokensLoading ? (
                <>
                  <SkeletonText fontSize="xl" className="w-full" />
                  <SkeletonText className="w-full" />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">Network</List.Label>
            <div className="flex items-center gap-2 font-medium rounded-xl ">
              <NetworkIcon chainId={chainId} width={24} height={24} /> {Chain.from(chainId).name}
            </div>
          </div>
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">Fee Tier</List.Label>
            <div className="flex items-center gap-2 font-medium rounded-xl ">{feeAmount / 10000}% Fee</div>
          </div>
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">Pool Type</List.Label>
            <div className="flex items-center gap-2 font-medium rounded-xl">Concentrated Liquidity</div>
          </div>
          <div className="flex flex-col col-span-2 gap-2">
            <List.Label className="!px-0">Current Price</List.Label>
            {!isInitialLoading && !pool ? (
              <span className="">N/A</span>
            ) : isInitialLoading ? (
              <SkeletonText className="w-[120px]" />
            ) : token0 && token1 && pool ? (
              <div>
                <Button icon={SwitchHorizontalIcon} variant="link" onClick={() => setInvert((prev) => !prev)}>
                  <div className="flex items-baseline gap-1.5">
                    {invert ? token1.symbol : token0.symbol} ={' '}
                    {pool.priceOf(invert ? token1.wrapped : token0.wrapped)?.toSignificant(4)}{' '}
                    {invert ? token0.symbol : token1.symbol}
                    <span className="text-sm font-normal">${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}</span>
                  </div>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col order-3 gap-10  pb-40 sm:order-2">
        <SelectNetworkWidget selectedNetwork={chainId} onSelect={setNetwork} networks={SUPPORTED_CHAIN_IDS} />
        <SelectTokensWidget
          chainId={chainId}
          token0={token0}
          token1={token1}
          setToken0={setToken0}
          setToken1={setToken1}
        />
        <SelectFeeConcentratedWidget
          feeAmount={feeAmount}
          setFeeAmount={setFeeAmount}
          token1={token1}
          token0={token0}
        />
        <SelectPricesWidget
          chainId={chainId}
          token0={token0}
          token1={token1}
          tokenId={tokenId}
          feeAmount={feeAmount}
          switchTokens={switchTokens}
        />

        <ContentBlock
          disabled={!token0 || !token1}
          title={
            <>
              How much <span className="text-gray-900 dark:text-white">liquidity</span> do you want to provide?
            </>
          }
        >
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={position ?? undefined}
            tokenId={tokenId}
            successLink={`/pools/${chainId}:${poolAddress}?activeTab=myPositions`}
          />
        </ContentBlock>
      </div>
    </>
  )
}
