import { ArrowLeftIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui'
import { Layout, SelectNetworkWidget, SelectPricesWidget, SelectTokensWidget } from '../../components'
import React, { FC, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'
import { ContentBlock } from '../../components/AddPage/ContentBlock'
import Link from 'next/link'
import { ConcentratedLiquidityProvider } from '../../components/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../components/ConcentratedLiquidityURLStateProvider'
import { SelectFeeConcentratedWidget } from '../../components/NewPositionSection/SelectFeeConcentratedWidget'
import { ConcentratedLiquidityWidget } from '../../components/ConcentratedLiquidityWidget'
import { useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPool, useConcentratedPositionInfo } from '@sushiswap/wagmi/future/hooks'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { tryParseAmount } from '@sushiswap/currency'
import { useTokenAmountDollarValues } from '../../lib/hooks'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { computePoolAddress } from '@sushiswap/v3-sdk'
import { getV3FactoryContractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3FactoryContract'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import { useRouter } from 'next/router'

export function AddPage() {
  const router = useRouter()
  return (
    <ConcentratedLiquidityURLStateProvider>
      {({ token0, chainId }) => (
        <SplashController show={Boolean(!token0 || !chainId || !router.isReady)}>
          <SWRConfig>
            <Layout>
              <div className="flex flex-col gap-2">
                <Link className="group flex gap-4 items-center mb-2" href="/" shallow={true}>
                  <IconButton
                    icon={ArrowLeftIcon}
                    iconProps={{
                      width: 24,
                      height: 24,
                      transparent: true,
                    }}
                  />
                  <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                    Go back to pools list
                  </span>
                </Link>
                <h1 className="text-3xl font-medium mt-2">Add Liquidity</h1>
                <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
                  Create a new pool or create a liquidity position on an existing pool.
                </h1>
              </div>
              <div className="h-0.5 w-full bg-gray-900/5 dark:bg-slate-200/5 my-10" />
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
          <div className="col-span-2 flex gap-7">
            <div className="flex min-w-[44px] mb-4">
              <Badge
                className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"
                position="bottom-right"
                badgeContent={
                  chainId ? (
                    <NetworkIcon chainId={chainId} width={24} height={24} />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
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
                  <h1 className="text-xl text-gray-900 dark:text-slate-50 font-semibold">
                    {token0.symbol}/{token1.symbol}
                  </h1>
                  <p className="font-medium text-gray-700 dark:dark:text-slate-400 text-slate-600">
                    SushiSwap V3 • {feeAmount / 10000}%
                  </p>
                </>
              ) : tokensLoading ? (
                <>
                  <Skeleton.Text fontSize="text-xl" className="w-full" />
                  <Skeleton.Text fontSize="text-base" className="w-full" />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Network</List.Label>
            <div className="flex font-medium items-center gap-2 rounded-xl ">
              <NetworkIcon chainId={chainId} width={24} height={24} /> {Chain.from(chainId).name}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Fee Tier</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl ">{feeAmount / 10000}% Fee</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Pool Type</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl">Concentrated Liquidity</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Current Price</List.Label>
            {!isInitialLoading && !pool ? (
              <span className="">N/A</span>
            ) : isInitialLoading ? (
              <Skeleton.Text className="w-[120px]" />
            ) : token0 && token1 && pool ? (
              <div
                onClick={() => setInvert((prev) => !prev)}
                role="button"
                className="flex items-center font-semibold gap-1.5 rounded-xl text-blue hover:text-blue-600"
              >
                <SwitchHorizontalIcon width={16} height={16} />
                <div className="flex items-baseline gap-1.5">
                  {invert ? token1.symbol : token0.symbol} ={' '}
                  {pool.priceOf(invert ? token1.wrapped : token0.wrapped)?.toSignificant(4)}{' '}
                  {invert ? token0.symbol : token1.symbol}
                  <span className="text-sm font-normal">${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col order-3 gap-[64px]  pb-40 sm:order-2">
        <SelectNetworkWidget selectedNetwork={chainId} onSelect={setNetwork} />
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

export default AddPage
