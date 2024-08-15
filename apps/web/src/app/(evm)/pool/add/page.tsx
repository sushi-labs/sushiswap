'use client'

import React, { FC, useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from 'src/ui/pool/ConcentratedLiquidityURLStateProvider'
import { ConcentratedLiquidityWidget } from 'src/ui/pool/ConcentratedLiquidityWidget'
import { SelectFeeConcentratedWidget } from 'src/ui/pool/SelectFeeConcentratedWidget'
import { SelectNetworkWidget } from 'src/ui/pool/SelectNetworkWidget'
import { SelectPricesWidget } from 'src/ui/pool/SelectPricesWidget'
import { SelectTokensWidget } from 'src/ui/pool/SelectTokensWidget'
import { ChainId, computeSushiSwapV3PoolAddress } from 'sushi'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  isWNativeSupported,
} from 'sushi/config'
import { tryParseAmount } from 'sushi/currency'
import { SWRConfig } from 'swr'
import { useAccount } from 'wagmi'

export default function Page() {
  return (
    <ConcentratedLiquidityURLStateProvider>
      <SWRConfig>
        <ConcentratedLiquidityProvider>
          <_Add />
        </ConcentratedLiquidityProvider>
      </SWRConfig>
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

  const [_invert, _setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrapped,
            tokenB: token1.wrapped,
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1],
  )

  const fiatAmounts = useMemo(
    () => [tryParseAmount('1', token0), tryParseAmount('1', token1)],
    [token0, token1],
  )
  const _fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId,
    amounts: fiatAmounts,
  })

  return (
    <>
      {/*<div className="hidden lg:block">*/}
      {/*  <div className="lg:grid grid-cols-2 items-center gap-6 sticky top-[96px]">*/}
      {/*    <div className="col-span-2 flex gap-7">*/}
      {/*      <div className="flex min-w-[44px] mb-4">*/}
      {/*        <Badge*/}
      {/*          className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%]"*/}
      {/*          position="bottom-right"*/}
      {/*          badgeContent={*/}
      {/*            chainId ? (*/}
      {/*              <NetworkIcon chainId={chainId} width={24} height={24} />*/}
      {/*            ) : (*/}
      {/*              <div className="w-6 h-6 rounded-full bg-gray-300" />*/}
      {/*            )*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <Currency.IconList iconWidth={48} iconHeight={48}>*/}
      {/*            {token0 && !tokensLoading ? (*/}
      {/*              <Currency.Icon currency={token0} />*/}
      {/*            ) : (*/}
      {/*              <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />*/}
      {/*            )}*/}
      {/*            {token1 && !tokensLoading ? (*/}
      {/*              <Currency.Icon currency={token1} />*/}
      {/*            ) : (*/}
      {/*              <div className="w-[48px] h-[48px] rounded-full bg-gray-300 dark:bg-slate-800" />*/}
      {/*            )}*/}
      {/*          </Currency.IconList>*/}
      {/*        </Badge>*/}
      {/*      </div>*/}
      {/*      <div className="flex flex-col flex-grow">*/}
      {/*        {token0 && token1 ? (*/}
      {/*          <>*/}
      {/*            <h1 className="text-xl text-gray-900 dark:text-slate-50 font-semibold">*/}
      {/*              {token0.symbol}/{token1.symbol}*/}
      {/*            </h1>*/}
      {/*            <p className="font-medium text-gray-700 dark:dark:text-slate-400 text-slate-600">*/}
      {/*              SushiSwap V3 • {feeAmount / 10000}%*/}
      {/*            </p>*/}
      {/*          </>*/}
      {/*        ) : tokensLoading ? (*/}
      {/*          <>*/}
      {/*            <SkeletonText fontSize="xl" className="w-full" />*/}
      {/*            <SkeletonText className="w-full" />*/}
      {/*          </>*/}
      {/*        ) : (*/}
      {/*          <></>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="col-span-2 flex flex-col gap-2">*/}
      {/*      <List.Label className="!px-0">Network</List.Label>*/}
      {/*      <div className="flex font-medium items-center gap-2 rounded-xl ">*/}
      {/*        <NetworkIcon chainId={chainId} width={24} height={24} /> {Chain.from(chainId)?.name}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="col-span-2 flex flex-col gap-2">*/}
      {/*      <List.Label className="!px-0">Fee Tier</List.Label>*/}
      {/*      <div className="flex items-center font-medium gap-2 rounded-xl ">{feeAmount / 10000}% Fee</div>*/}
      {/*    </div>*/}
      {/*    <div className="col-span-2 flex flex-col gap-2">*/}
      {/*      <List.Label className="!px-0">Pool Type</List.Label>*/}
      {/*      <div className="flex items-center font-medium gap-2 rounded-xl">Concentrated Liquidity</div>*/}
      {/*    </div>*/}
      {/*    <div className="col-span-2 flex flex-col gap-2">*/}
      {/*      <List.Label className="!px-0">Current Price</List.Label>*/}
      {/*      {!isInitialLoading && !pool ? (*/}
      {/*        <span className="">N/A</span>*/}
      {/*      ) : isInitialLoading ? (*/}
      {/*        <SkeletonText className="w-[120px]" />*/}
      {/*      ) : token0 && token1 && pool ? (*/}
      {/*        <div>*/}
      {/*          <Button icon={SwitchHorizontalIcon} variant="link" onClick={() => setInvert((prev) => !prev)}>*/}
      {/*            <div className="flex items-baseline gap-1.5">*/}
      {/*              {invert ? token1.symbol : token0.symbol} ={' '}*/}
      {/*              {pool.priceOf(invert ? token1.wrapped : token0.wrapped)?.toSignificant(4)}{' '}*/}
      {/*              {invert ? token0.symbol : token1.symbol}*/}
      {/*              <span className="text-sm font-normal">${fiatAmountsAsNumber[invert ? 1 : 0].toFixed(2)}</span>*/}
      {/*            </div>*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      ) : null}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={setNetwork}
        networks={SUSHISWAP_V3_SUPPORTED_CHAIN_IDS as unknown as ChainId[]}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
        includeNative={isWNativeSupported(chainId)}
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
        poolAddress={poolAddress}
        tokenId={tokenId}
        feeAmount={feeAmount}
        switchTokens={switchTokens}
      />
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
    </>
  )
}
