'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible, LinkInternal, classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useState } from 'react'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { useConcentratedLiquidityPosition } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-position'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import {
  type EvmChainId,
  type EvmCurrency,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  type SushiSwapV3FeeAmount,
  computeSushiSwapV3PoolAddress,
  getEvmChainById,
  isSushiSwapV3ChainId,
  isWNativeSupported,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '~evm/[chainId]/pool/_ui/concentrated-liquidity-url-state-provider'
import { ConcentratedLiquidityProvider } from '../concentrated-liquidity-provider'
import { ConcentratedLiquidityWidget } from './conentrated-liquidity-widget'
import { DoesNotExistMessage } from './does-not-exist-message'
import { SelectFeeConcentratedWidget } from './select-fee-concentrated-widget'
import { SelectPriceWidget } from './select-price-widget'
import { SelectTokensWidgetV2 } from './select-tokens-widget-v2'

export const AddLiquidityV3 = ({
  initToken0,
  initToken1,
  hideTokenSelectors,
  feeAmount,
  chainId,
}: {
  initToken0: EvmCurrency | undefined
  initToken1: EvmCurrency | undefined
  hideTokenSelectors?: boolean
  feeAmount?: SushiSwapV3FeeAmount
  chainId: EvmChainId
}) => {
  if (!isSushiSwapV3ChainId(chainId)) {
    return null
  }

  return (
    <ConcentratedLiquidityURLStateProvider chainId={chainId}>
      <ConcentratedLiquidityProvider>
        <_Add
          initToken0={initToken0}
          initToken1={initToken1}
          hideTokenSelectors={hideTokenSelectors}
          initFeeAmount={feeAmount}
        />
      </ConcentratedLiquidityProvider>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _Add = ({
  initToken0,
  initToken1,
  hideTokenSelectors,
  initFeeAmount,
}: {
  initToken0: EvmCurrency | undefined
  initToken1: EvmCurrency | undefined
  hideTokenSelectors?: boolean
  initFeeAmount?: SushiSwapV3FeeAmount
}) => {
  const [step, setStep] = useState(0)
  const { address } = useAccount()
  const {
    chainId,
    token0,
    token1,
    setToken1,
    setToken0,
    feeAmount,
    setFeeAmount,
    tokensLoading,
    tokenId,
    switchTokens,
    initializeTokens,
  } = useConcentratedLiquidityURLState()
  const [isFirstMount, setIsFirstMount] = useState(true)

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrap(),
            tokenB: token1.wrap(),
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1],
  )

  const { data: positionData } = useConcentratedLiquidityPosition({
    account: address,
    chainId: chainId,
    feeAmount: initFeeAmount,
    poolAddress,
    enabled: Boolean(initToken0 && initToken1 && initFeeAmount),
  })
  const _tokenId = positionData?.tokenId?.toString() ?? tokenId

  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId: _tokenId,
    token1,
  })
  const { data: pools, isLoading: isLoadingPools } = usePoolsByTokenPair(
    token0?.wrap().id,
    token1?.wrap().id,
  )

  const poolExists = useMemo(() => {
    if (isLoadingPools) return true
    return pools?.some((pool) => {
      return (
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token0?.wrap().id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token1?.wrap().id.toLowerCase()) ||
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token1?.wrap().id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token0?.wrap().id.toLowerCase())
      )
    })
  }, [feeAmount, pools, token0, token1, isLoadingPools])

  const hasSteps = !initToken0 && !initToken1

  useEffect(() => {
    if (initToken0 && initToken1) {
      setStep(1)
    }
    if (initToken0 && initToken1 && initFeeAmount && isFirstMount) {
      if (!isFirstMount) return
      initializeTokens(initToken0, initToken1, initFeeAmount)
      setIsFirstMount(false)
    }
  }, [initToken0, initToken1, initFeeAmount, initializeTokens, isFirstMount])

  return (
    <div
      className={classNames(
        'flex flex-col gap-4',
        hideTokenSelectors ? 'mt-4' : '',
      )}
    >
      {hasSteps && step === 0 ? (
        <p className="font-medium text-slate-900 dark:text-pink-100 text-base">
          Select A Pool
        </p>
      ) : null}
      {hasSteps && step === 1 ? (
        <button
          onClick={() => setStep(0)}
          type="button"
          className="font-medium w-fit flex items-center text-blue dark:text-skyblue text-base"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Select A Pool
        </button>
      ) : null}
      {step === 0 ? (
        <>
          <SelectTokensWidgetV2
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
          {!poolExists && token0 && token1 && feeAmount ? (
            <>
              <Collapsible open={!poolExists} className="w-full">
                <DoesNotExistMessage type="SUSHISWAP_V3" />
              </Collapsible>
            </>
          ) : null}
          <LinkInternal
            className={classNames(
              'w-full',
              !feeAmount || !token0 || !token1 ? 'pointer-events-none' : '',
            )}
            href={
              feeAmount
                ? `/${
                    getEvmChainById(chainId).key
                  }/pool/v3/${poolAddress}/add?feeAmount=${feeAmount}&fromCurrency=${
                    token0?.isNative ? 'NATIVE' : token0?.address
                  }&toCurrency=${token1?.isNative ? 'NATIVE' : token1?.address}`
                : ''
            }
          >
            <Button
              disabled={!feeAmount || !token0 || !token1}
              className="w-full"
            >
              Next
            </Button>
          </LinkInternal>
        </>
      ) : null}
      {step === 1 ? (
        <>
          {!poolExists && token0 && token1 && feeAmount ? (
            <>
              <Collapsible open={!poolExists} className="w-full">
                <DoesNotExistMessage type="SUSHISWAP_V3" />
              </Collapsible>
            </>
          ) : null}
          <SelectPriceWidget
            chainId={chainId}
            token0={token0}
            token1={token1}
            poolAddress={poolAddress}
            tokenId={_tokenId}
            feeAmount={feeAmount}
            switchTokens={switchTokens}
          />
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            setToken0={initToken0 ? undefined : setToken0}
            setToken1={initToken1 ? undefined : setToken1}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={position ?? undefined}
            tokenId={_tokenId}
            successLink={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}/${_tokenId ?? 'positions'}`}
            inputClassName={
              initToken0 && initToken1
                ? '!bg-gray-100 dark:!bg-slate-900'
                : undefined
            }
          />
        </>
      ) : null}
    </div>
  )
}
