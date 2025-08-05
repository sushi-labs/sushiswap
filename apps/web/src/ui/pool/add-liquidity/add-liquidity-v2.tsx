'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { Button, Collapsible, Dots, Loader, classNames } from '@sushiswap/ui'
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { isZapSupportedChainId } from 'src/config'
import {
  APPROVE_TAG_ADD_LEGACY,
  APPROVE_TAG_ZAP_LEGACY,
  NativeAddress,
} from 'src/lib/constants'
import { isSushiSwapV2Pool } from 'src/lib/functions'
import { isZapRouteNotFoundError, useZap } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import {
  Checker,
  SLIPPAGE_WARNING_THRESHOLD,
} from 'src/lib/wagmi/systems/Checker'
import {
  CheckerProvider,
  useApproved,
} from 'src/lib/wagmi/systems/Checker/Provider'
import { PoolFinder } from 'src/lib/wagmi/systems/PoolFinder/PoolFinder'
import { PriceImpactWarning, SlippageWarning } from 'src/ui/common'
import { ZapInfoCard } from 'src/ui/pool/ZapInfoCard'
import type { EvmChainId } from 'sushi/chain'
import {
  SUSHISWAP_V2_ROUTER_ADDRESS,
  defaultCurrency,
  isSushiSwapV2ChainId,
  isWNativeSupported,
} from 'sushi/config'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { Amount, type Type, tryParseAmount } from 'sushi/currency'
import { Percent, ZERO } from 'sushi/math'
import type { SushiSwapV2Pool } from 'sushi/pool/sushiswap-v2'
import type { SendTransactionReturnType } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useCurrentChainId } from '../../../lib/hooks/useCurrentChainId'
import { ToggleZapCard } from '../ToggleZapCard'
import { AddLiquidityV2Button } from './add-liquidity-v2-button'
import { DoesNotExistMessage } from './does-not-exist-message'
import { EstimatedValue } from './estimated-value'
import { InitialPrice } from './initial-price'
import { SelectTokensWidgetV2 } from './select-tokens-widget-v2'

export const AddLiquidityV2 = ({
  initToken0,
  initToken1,
  hideTokenSelectors,
}: {
  initToken0?: Type
  initToken1?: Type
  hideTokenSelectors?: boolean
}) => {
  const { chainId } = useCurrentChainId() as { chainId: SushiSwapV2ChainId }

  const [isZapModeEnabled, setIsZapModeEnabled] = useState(false)

  const [token0, setToken0] = useState<Type | undefined>(
    defaultCurrency[chainId as keyof typeof defaultCurrency],
  )
  const [token1, setToken1] = useState<Type | undefined>(undefined)

  useEffect(() => {
    if (!initToken0) {
      setToken0(defaultCurrency[chainId as keyof typeof defaultCurrency])
    }
    if (initToken0 && initToken1) {
      setToken0(initToken0)
      setToken1(initToken1)
    }
  }, [chainId, initToken0, initToken1])

  // 	const networks = useMemo(
  // 	() =>
  // 		SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.filter(
  // 			(chainId) =>
  // 				!EVM_TESTNET_CHAIN_IDS.includes(chainId as (typeof EVM_TESTNET_CHAIN_IDS)[number]) &&
  // 				!DISABLED_CHAIN_IDS.includes(chainId as (typeof DISABLED_CHAIN_IDS)[number])
  // 		),
  // 	[]
  // );

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const [independendField, setIndependendField] = useState(0)

  const _setToken0 = useCallback(
    (token: Type | undefined): void => {
      if (token?.id === token1?.id) return

      setIndependendField(1)
      setTypedAmounts((prev) => ({ ...prev, input0: '' }))

      if (token && token1 && token.chainId !== token1.chainId) {
        setToken1(undefined)
        setTypedAmounts((prev) => ({ ...prev, input1: '' }))
      }

      setToken0(token)
    },
    [token1],
  )

  const _setToken1 = useCallback(
    (token: Type | undefined): void => {
      if (token?.id === token0?.id) return

      setIndependendField(0)
      setTypedAmounts((prev) => ({ ...prev, input1: '' }))

      if (token && token0 && token.chainId !== token0.chainId) {
        setToken0(undefined)
        setTypedAmounts((prev) => ({ ...prev, input0: '' }))
      }

      setToken1(token)
    },
    [token0],
  )
  const { data: price0, isLoading: isPrice0Loading } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrapped?.address,
    enabled: !!token0,
  })
  const { data: price1, isLoading: isPrice1Loading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrapped?.address,
    enabled: !!token1,
  })

  const estimatedValue = useMemo(() => {
    if (!token0 || !token1) return '0'
    const amount0 = tryParseAmount(input0, token0)?.quotient
    const amount1 = tryParseAmount(input1, token1)?.quotient
    if (!amount0 || !amount1) return '0'
    const value0 = price0
      ? (price0 * Number(amount0)) / 10 ** token0.decimals
      : 0
    const value1 = price1
      ? (price1 * Number(amount1)) / 10 ** token1.decimals
      : 0

    return (
      (Number.isNaN(value0) ? 0 : value0) + (Number.isNaN(value1) ? 0 : value1)
    ).toFixed(2)
  }, [input0, input1, token0, token1, price0, price1])

  return (
    <PoolFinder
      components={
        <PoolFinder.Components>
          <PoolFinder.SushiSwapV2Pool
            chainId={chainId}
            token0={token0}
            token1={token1}
            enabled={isSushiSwapV2ChainId(chainId)}
          />
        </PoolFinder.Components>
      }
    >
      {({ pool: [poolState, pool] }) => {
        const doesNotExist = poolState === SushiSwapV2PoolState.NOT_EXISTS
        if (doesNotExist) {
          setIsZapModeEnabled(false)
        }

        const title =
          !token0 || !token1 ? (
            'Select Tokens'
          ) : [SushiSwapV2PoolState.LOADING].includes(
              poolState as SushiSwapV2PoolState,
            ) ? (
            <div className="h-[20px] flex items-center justify-center">
              <Loader width={14} />
            </div>
          ) : [SushiSwapV2PoolState.EXISTS].includes(
              poolState as SushiSwapV2PoolState,
            ) ? (
            'Add Liquidity'
          ) : (
            'Create Pool'
          )

        return (
          <div
            className={classNames(
              'flex flex-col gap-4',
              hideTokenSelectors ? 'mt-4' : '',
            )}
          >
            {hideTokenSelectors ? null : (
              <>
                <p className="text-base font-medium text-slate-900 dark:text-pink-100">
                  Select A Pool
                </p>
                <SelectTokensWidgetV2
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  setToken0={_setToken0}
                  setToken1={_setToken1}
                  includeNative={isWNativeSupported(chainId)}
                />
              </>
            )}
            {doesNotExist && token0 && token1 ? (
              <>
                <Collapsible open={doesNotExist} className="w-full">
                  <DoesNotExistMessage type="SUSHISWAP_V2" />
                </Collapsible>
                <Collapsible open={doesNotExist} className="w-full">
                  <div className="flex flex-col gap-4">
                    <p className="text-base font-medium text-slate-900 dark:text-pink-100">
                      Set Price
                    </p>
                    <InitialPrice
                      token0={token0}
                      token1={token1}
                      input0={input0}
                      input1={input1}
                    />
                  </div>
                </Collapsible>
              </>
            ) : null}
            <div>
              {hideTokenSelectors ? null : (
                <p className="pb-2 text-base font-medium text-slate-900 dark:text-pink-100">
                  Deposit
                </p>
              )}
              <div className="flex flex-col gap-4">
                {isZapSupportedChainId(chainId) &&
                poolState === SushiSwapV2PoolState.EXISTS ? (
                  <ToggleZapCard
                    checked={isZapModeEnabled}
                    onCheckedChange={setIsZapModeEnabled}
                  />
                ) : null}
                {isZapModeEnabled ? (
                  <ZapWidget
                    chainId={chainId}
                    pool={pool}
                    poolState={poolState}
                    title={title}
                  />
                ) : (
                  <AddLiquidityWidget
                    chainId={token0?.chainId ?? token1?.chainId ?? chainId}
                    pool={pool}
                    poolState={poolState}
                    title={title}
                    token0={token0}
                    token1={token1}
                    setToken0={_setToken0}
                    setToken1={_setToken1}
                    input0={input0}
                    input1={input1}
                    setTypedAmounts={setTypedAmounts}
                    independendField={independendField}
                    setIndependendField={setIndependendField}
                    hideTokenSelectors={hideTokenSelectors}
                  />
                )}
              </div>
            </div>
            <EstimatedValue
              dollarValue={estimatedValue}
              isLoading={isPrice0Loading || isPrice1Loading}
            />
          </div>
        )
      }}
    </PoolFinder>
  )
}

interface ZapWidgetProps {
  chainId: EvmChainId
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  title: ReactNode
}

const ZapWidget: FC<ZapWidgetProps> = (props) => {
  return (
    <CheckerProvider>
      <_ZapWidget {...props} />
    </CheckerProvider>
  )
}

const _ZapWidget: FC<ZapWidgetProps> = ({
  chainId,
  pool,
  poolState,
  title,
}) => {
  const client = usePublicClient()

  const { address, chain } = useAccount()

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, _setInputCurrency] = useState<Type>(
    defaultCurrency[chainId as keyof typeof defaultCurrency],
  )
  const setInputCurrency = useCallback((currency: Type) => {
    _setInputCurrency(currency)
    setInputAmount('')
  }, [])

  const parsedInputAmount = useMemo(
    () =>
      tryParseAmount(inputAmount, inputCurrency) ||
      Amount.fromRawAmount(inputCurrency, 0),
    [inputAmount, inputCurrency],
  )

  const {
    data: zapResponse,
    isLoading: isZapLoading,
    isError: isZapError,
    error: zapError,
  } = useZap({
    chainId,
    fromAddress: address,
    tokenIn: inputCurrency.isNative ? NativeAddress : inputCurrency.address,
    amountIn: parsedInputAmount?.quotient?.toString(),
    tokenOut: pool?.liquidityToken.address,
    slippage: slippageTolerance,
  })

  useEffect(() => {
    if (!zapError) return

    sendAnalyticsEvent(ZapEventName.ZAP_ERROR, {
      error: zapError.message,
    })
  }, [zapError])

  const { approved } = useApproved(APPROVE_TAG_ZAP_LEGACY)

  const {
    data: estGas,
    isError: isEstGasError,
    error: estGasError,
  } = useEstimateGas({
    chainId,
    account: address,
    to: zapResponse?.tx.to,
    data: zapResponse?.tx.data,
    value: zapResponse?.tx.value,
    query: {
      enabled: Boolean(approved && address && zapResponse?.tx),
    },
  })

  useEffect(() => {
    if (!estGasError) return

    sendAnalyticsEvent(ZapEventName.ZAP_ESTIMATE_GAS_CALL_FAILED, {
      error: estGasError.message,
    })
  }, [estGasError])

  const preparedTx = useMemo(() => {
    return zapResponse && estGas
      ? { ...zapResponse.tx, gas: estGas }
      : undefined
  }, [zapResponse, estGas])

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const onSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      if (!chain || !pool) return

      setInputAmount('')

      const promise = client.waitForTransactionReceipt({ hash })
      promise.then(() => {
        refetchBalances(chain.id)
      })

      sendAnalyticsEvent(ZapEventName.ZAP_SIGNED, {
        txHash: hash,
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId: chain.id,
        txHash: hash,
        promise: promise,
        summary: {
          pending: `Zapping into the ${pool.token0.symbol}/${pool.token1.symbol} pair`,
          completed: `Successfully zapped into the ${pool.token0.symbol}/${pool.token1.symbol} pair`,
          failed: `Something went wrong when zapping into the ${pool.token0.symbol}/${pool.token1.symbol} pair`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })

      const receipt = await promise
      if (receipt.status === 'success') {
        sendAnalyticsEvent(ZapEventName.ZAP_TRANSACTION_COMPLETED, {
          txHash: hash,
          from: receipt.from,
          chain_id: chain.id,
        })
      } else {
        sendAnalyticsEvent(ZapEventName.ZAP_TRANSACTION_FAILED, {
          txHash: hash,
          from: receipt.from,
          chain_id: chain.id,
        })
      }
    },
    [refetchBalances, client, chain, address, pool],
  )

  const { sendTransaction, isPending: isWritePending } = useSendTransaction({
    mutation: { onSuccess },
  })

  const [checked, setChecked] = useState(false)

  const showPriceImpactWarning = useMemo(() => {
    const priceImpactSeverity = warningSeverity(
      typeof zapResponse?.priceImpact === 'number'
        ? new Percent(zapResponse.priceImpact, 10_000n)
        : undefined,
    )
    return priceImpactSeverity > 3
  }, [zapResponse?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !slippageTolerance.lessThan(SLIPPAGE_WARNING_THRESHOLD)
  }, [slippageTolerance])

  return (
    <>
      <Web3Input.Currency
        id="zap-liquidity-token"
        type="INPUT"
        className="p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
        chainId={chainId}
        networks={[chainId]}
        selectedNetwork={chainId}
        value={inputAmount}
        onChange={setInputAmount}
        onSelect={setInputCurrency}
        currency={inputCurrency}
        disabled={
          poolState === SushiSwapV2PoolState.LOADING ||
          poolState === SushiSwapV2PoolState.INVALID
        }
        loading={poolState === SushiSwapV2PoolState.LOADING}
        allowNative={isWNativeSupported(chainId)}
        hidePercentageInputs={true}
      />
      <Checker.Connect fullWidth>
        <Checker.Network fullWidth chainId={chainId}>
          <Checker.Amounts
            fullWidth
            chainId={chainId}
            amount={parsedInputAmount}
          >
            <Checker.Guard
              guardWhen={!checked && showPriceImpactWarning}
              guardText="Price impact too high"
              variant="destructive"
              size="xl"
              fullWidth
            >
              <Checker.Slippage
                fullWidth
                text="Zap With High Slippage"
                slippageTolerance={slippageTolerance}
              >
                <Checker.ApproveERC20
                  id="approve-token"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={parsedInputAmount}
                  contract={zapResponse?.tx.to}
                >
                  <Checker.Success tag={APPROVE_TAG_ZAP_LEGACY}>
                    <Button
                      size="xl"
                      fullWidth
                      testId="zap-liquidity"
                      onClick={() => preparedTx && sendTransaction(preparedTx)}
                      loading={isZapLoading || isWritePending}
                      disabled={!preparedTx}
                    >
                      {zapError && isZapRouteNotFoundError(zapError) ? (
                        'No route found'
                      ) : isZapError || isEstGasError ? (
                        'Shoot! Something went wrong :('
                      ) : isWritePending ? (
                        <Dots>Confirm Transaction</Dots>
                      ) : (
                        title
                      )}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Slippage>
            </Checker.Guard>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
      {showSlippageWarning && <SlippageWarning className="mt-4" />}
      {showPriceImpactWarning && (
        <PriceImpactWarning
          className="mt-4"
          checked={checked}
          setChecked={setChecked}
        />
      )}
      <ZapInfoCard
        zapResponse={zapResponse}
        inputCurrencyAmount={parsedInputAmount}
        pool={pool}
      />
    </>
  )
}

interface AddLiquidityWidgetProps {
  chainId: EvmChainId
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0: (token: Type | undefined) => void
  setToken1: (token: Type | undefined) => void
  input0: string
  input1: string
  setTypedAmounts: Dispatch<SetStateAction<{ input0: string; input1: string }>>
  independendField: number
  setIndependendField: Dispatch<SetStateAction<number>>
  hideTokenSelectors?: boolean
}

const AddLiquidityWidget: FC<AddLiquidityWidgetProps> = ({
  chainId,
  pool,
  poolState,
  title,
  token0,
  token1,
  setToken0,
  setToken1,
  input0,
  input1,
  setTypedAmounts,
  independendField,
  setIndependendField,
  hideTokenSelectors,
}) => {
  const [slippagePercent] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const [parsedInput0, parsedInput1] = useMemo(() => {
    if (!token0 || !token1) return [undefined, undefined]

    return [
      tryParseAmount(input0, token0) || Amount.fromRawAmount(token0, 0),
      tryParseAmount(input1, token1) || Amount.fromRawAmount(token1, 0),
    ]
  }, [input0, input1, token0, token1])

  const noLiquidity = useMemo(() => {
    return pool?.reserve0.equalTo(ZERO) && pool.reserve1.equalTo(ZERO)
  }, [pool])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      setIndependendField(0)
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS || noLiquidity) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        setTypedAmounts({
          input0: value,
          input1: '',
        })
      }
    },
    [
      noLiquidity,
      pool,
      poolState,
      token0,
      setIndependendField,
      setTypedAmounts,
    ],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      setIndependendField(1)
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS || noLiquidity) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        setTypedAmounts({
          input0: '',
          input1: value,
        })
      }
    },
    [
      noLiquidity,
      pool,
      poolState,
      token1,
      setIndependendField,
      setTypedAmounts,
    ],
  )

  useEffect(() => {
    // Includes !!pool
    if (
      pool?.reserve0.greaterThan(0) &&
      pool.reserve1.greaterThan(0) &&
      token0 &&
      token1
    ) {
      if (independendField === 0) {
        const parsedAmount = tryParseAmount(input0, token0)
        setTypedAmounts({
          input0,
          input1: parsedAmount
            ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
        })
      }

      if (independendField === 1) {
        const parsedAmount = tryParseAmount(input1, token1)
        setTypedAmounts({
          input0: parsedAmount
            ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
          input1,
        })
      }
    }
  }, [independendField, pool, input0, input1, token0, token1, setTypedAmounts])

  return (
    <>
      <div className="flex flex-col gap-4">
        <Web3Input.Currency
          id="add-liquidity-token0"
          type="INPUT"
          className="p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
          chainId={chainId}
          value={input0}
          onChange={onChangeToken0TypedAmount}
          onSelect={hideTokenSelectors ? undefined : setToken0}
          currency={token0}
          hidePercentageInputs={true}
          disabled={
            !token0 ||
            poolState === SushiSwapV2PoolState.LOADING ||
            poolState === SushiSwapV2PoolState.INVALID
          }
          loading={poolState === SushiSwapV2PoolState.LOADING}
          allowNative={isWNativeSupported(chainId)}
        />
        <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
          <button
            type="button"
            className="z-10 p-2 bg-gray-100 rounded-full border dark:bg-slate-900 border-slate-50 dark:border-slate-800"
          >
            <PlusIcon
              strokeWidth={3}
              className="w-4 h-4 dark:text-skyblue text-blue"
            />
          </button>
        </div>
        <Web3Input.Currency
          id="add-liquidity-token1"
          type="INPUT"
          className="p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
          chainId={chainId}
          value={input1}
          onChange={onChangeToken1TypedAmount}
          onSelect={hideTokenSelectors ? undefined : setToken1}
          currency={token1}
          hidePercentageInputs={true}
          disabled={
            !token1 ||
            poolState === SushiSwapV2PoolState.LOADING ||
            poolState === SushiSwapV2PoolState.INVALID
          }
          loading={poolState === SushiSwapV2PoolState.LOADING}
          allowNative={isWNativeSupported(chainId)}
        />
        <CheckerProvider>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={chainId}>
              <Checker.Amounts
                fullWidth
                chainId={chainId}
                amounts={useMemo(
                  () => [parsedInput0, parsedInput1],
                  [parsedInput0, parsedInput1],
                )}
              >
                <Checker.Slippage
                  fullWidth
                  slippageTolerance={slippagePercent}
                  text="Continue With High Slippage"
                >
                  {(!pool || isSushiSwapV2Pool(pool)) &&
                    isSushiSwapV2ChainId(chainId) && (
                      <Checker.ApproveERC20
                        id="approve-token-0"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={parsedInput0}
                        contract={SUSHISWAP_V2_ROUTER_ADDRESS[chainId]}
                      >
                        <Checker.ApproveERC20
                          id="approve-token-1"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={parsedInput1}
                          contract={SUSHISWAP_V2_ROUTER_ADDRESS[chainId]}
                        >
                          <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                            {/* <AddSectionReviewModalLegacy
                              poolAddress={pool?.liquidityToken.address}
                              poolState={poolState as SushiSwapV2PoolState}
                              chainId={chainId}
                              token0={token0}
                              token1={token1}
                              input0={parsedInput0}
                              input1={parsedInput1}
                              onSuccess={() => {
                                setTypedAmounts({ input0: '', input1: '' })
                              }}
                            >
                              <Button
                                size="xl"
                                fullWidth
                                className="!mt-10"
                                testId="add-liquidity"
                              >
                                {title}
                              </Button>
                            </AddSectionReviewModalLegacy> */}
                            {title === 'Add Liquidity' ? (
                              <AddLiquidityV2Button
                                poolState={poolState as SushiSwapV2PoolState}
                                chainId={chainId}
                                token0={token0}
                                token1={token1}
                                input0={parsedInput0}
                                input1={parsedInput1}
                                onSuccess={() => {
                                  setTypedAmounts({ input0: '', input1: '' })
                                }}
                              />
                            ) : (
                              <Button
                                size="xl"
                                fullWidth
                                className="!mt-10"
                                testId="add-liquidity"
                              >
                                {title}
                              </Button>
                            )}
                          </Checker.Success>
                        </Checker.ApproveERC20>
                      </Checker.ApproveERC20>
                    )}
                </Checker.Slippage>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </CheckerProvider>
      </div>
    </>
  )
}
