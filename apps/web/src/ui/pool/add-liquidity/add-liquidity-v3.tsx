'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { Button, Collapsible, classNames } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { useCurrentChainId } from 'src/lib/hooks/useCurrentChainId'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { ConcentratedLiquidityProvider } from 'src/ui/pool/ConcentratedLiquidityProvider'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from 'src/ui/pool/ConcentratedLiquidityURLStateProvider'
import { computeSushiSwapV3PoolAddress } from 'sushi'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  isWNativeSupported,
} from 'sushi/config'
import type { SushiSwapV3FeeAmount } from 'sushi/config'
import type { Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
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
}: {
  initToken0?: Type
  initToken1?: Type
  hideTokenSelectors?: boolean
  feeAmount?: SushiSwapV3FeeAmount
}) => {
  const { chainId } = useCurrentChainId() as { chainId: SushiSwapV3ChainId }

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
  initToken0?: Type
  initToken1?: Type
  hideTokenSelectors?: boolean
  initFeeAmount?: SushiSwapV3FeeAmount
}) => {
  const [step, setStep] = useState(0)
  const { address } = useAccount()
  const { createQuery } = useCreateQuery()
  const [isFirstMount, setIsFirstMount] = useState(true)
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
  } = useConcentratedLiquidityURLState()

  const [_invert, _setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })
  const { data: pools } = usePoolsByTokenPair(
    token0?.wrapped.id,
    token1?.wrapped.id,
  )

  const poolExists = useMemo(() => {
    return pools?.some((pool) => {
      return (
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token0?.wrapped.id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token1?.wrapped.id.toLowerCase()) ||
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token1?.wrapped.id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token0?.wrapped.id.toLowerCase())
      )
    })
  }, [feeAmount, pools, token0, token1])

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

  const hasSteps = !initToken0 && !initToken1

  useEffect(() => {
    if (initToken0 && initToken1) {
      setStep(1)
    }
    if (initFeeAmount && initToken0 && initToken1 && isFirstMount) {
      if (!isFirstMount) return
      setIsFirstMount(false)
      createQuery([
        {
          name: 'fromCurrency',
          value: initToken0.isNative ? 'NATIVE' : initToken0.address,
        },
        {
          name: 'toCurrency',
          value: initToken1.isNative ? 'NATIVE' : initToken1.address,
        },
        { name: 'feeAmount', value: initFeeAmount.toString() },
      ])
    }
  }, [initToken0, initToken1, initFeeAmount, createQuery, isFirstMount])

  const nextStep = () => {
    if (step === 0) {
      if (token0 && token1 && feeAmount) {
        setStep(1)
      }
    }
  }

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
                <DoesNotExistMessage />
              </Collapsible>
            </>
          ) : null}
          <Button onClick={nextStep}>Next</Button>
        </>
      ) : null}
      {step === 1 ? (
        <>
          {!poolExists && token0 && token1 && feeAmount ? (
            <>
              <Collapsible open={!poolExists} className="w-full">
                <DoesNotExistMessage />
              </Collapsible>
            </>
          ) : null}
          <SelectPriceWidget
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
            setToken0={initToken0 ? undefined : setToken0}
            setToken1={initToken1 ? undefined : setToken1}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={position ?? undefined}
            tokenId={tokenId}
            // successLink={`/${ChainKey[chainId]}/pool/v3/${poolAddress}/${tokenId ?? "positions"}`}
          />
        </>
      ) : null}
    </div>
  )
}
