'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { Button, Dots, FormSection, Loader } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import React, {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
  use,
} from 'react'
import { DISABLED_CHAIN_IDS, isZapSupportedChainId } from 'src/config'
import {
  APPROVE_TAG_ADD_LEGACY,
  APPROVE_TAG_ZAP_LEGACY,
  NativeAddress,
} from 'src/lib/constants'
import { isSushiSwapV2Pool } from 'src/lib/functions'
import { useZap } from 'src/lib/hooks'
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
import { AddSectionPoolShareCardV2 } from 'src/ui/pool/AddSectionPoolShareCardV2'
import { AddSectionReviewModalLegacy } from 'src/ui/pool/AddSectionReviewModalLegacy'
import { SelectNetworkWidget } from 'src/ui/pool/SelectNetworkWidget'
import { SelectTokensWidget } from 'src/ui/pool/SelectTokensWidget'
import { ToggleZapCard } from 'src/ui/pool/ToggleZapCard'
import { ZapInfoCard } from 'src/ui/pool/ZapInfoCard'
import {
  EVM_TESTNET_CHAIN_IDS,
  type EvmChainId,
  EvmChainKey,
} from 'sushi/chain'
import {
  SUSHISWAP_V2_ROUTER_ADDRESS,
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  defaultCurrency,
  defaultQuoteCurrency,
  isSushiSwapV2ChainId,
  isWNativeSupported,
} from 'sushi/config'
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

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  const chainId = +params.chainId as EvmChainId
  if (!isSushiSwapV2ChainId(chainId)) {
    return notFound()
  }

  const [isZapModeEnabled, setIsZapModeEnabled] = useState(false)

  const router = useRouter()
  const [token0, setToken0] = useState<Type | undefined>(
    defaultCurrency[chainId as keyof typeof defaultCurrency],
  )
  const [token1, setToken1] = useState<Type | undefined>(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

  useEffect(() => {
    setToken0(defaultCurrency[chainId as keyof typeof defaultCurrency])
    setToken1(
      defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
    )
  }, [chainId])

  const networks = useMemo(
    () =>
      SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.filter(
        (chainId) =>
          !EVM_TESTNET_CHAIN_IDS.includes(
            chainId as (typeof EVM_TESTNET_CHAIN_IDS)[number],
          ) &&
          !DISABLED_CHAIN_IDS.includes(
            chainId as (typeof DISABLED_CHAIN_IDS)[number],
          ),
      ),
    [],
  )

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const [independendField, setIndependendField] = useState(0)

  const _setToken0 = useCallback(
    (token: Type | undefined) => {
      if (token?.id === token1?.id) return
      setIndependendField(1)
      setTypedAmounts((prev) => ({ ...prev, input0: '' }))
      setToken0(token)
    },
    [token1],
  )

  const _setToken1 = useCallback(
    (token: Type | undefined) => {
      if (token?.id === token0?.id) return
      setIndependendField(0)
      setTypedAmounts((prev) => ({ ...prev, input1: '' }))
      setToken1(token)
    },
    [token0],
  )

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
        useEffect(() => {
          if (
            isZapSupportedChainId(chainId) &&
            poolState === SushiSwapV2PoolState.EXISTS
          ) {
            setIsZapModeEnabled(true)
          } else {
            setIsZapModeEnabled(false)
          }
        }, [poolState])

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
          <>
            <SelectNetworkWidget
              networks={networks}
              selectedNetwork={chainId}
              onSelect={(chainId) => {
                if (!isSushiSwapV2ChainId(chainId)) return
                router.push(`/${EvmChainKey[chainId]}/pool/v2/add`)
              }}
            />
            <SelectTokensWidget
              chainId={chainId}
              token0={token0}
              token1={token1}
              setToken0={_setToken0}
              setToken1={_setToken1}
              includeNative={isWNativeSupported(chainId)}
            />
            <FormSection
              title="Deposit"
              description="Select the amount of tokens you want to deposit"
            >
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
                  chainId={chainId}
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
                />
              )}
            </FormSection>
          </>
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
        className="p-3 bg-white dark:bg-slate-800 rounded-xl"
        chainId={chainId}
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
                      loading={!preparedTx || isWritePending}
                      disabled={isZapError || isEstGasError}
                    >
                      {isZapError || isEstGasError ? (
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
          className="p-3 bg-white dark:bg-slate-800 rounded-xl"
          chainId={chainId}
          value={input0}
          onChange={onChangeToken0TypedAmount}
          onSelect={setToken0}
          currency={token0}
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
            className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900"
          >
            <PlusIcon
              strokeWidth={3}
              className="w-4 h-4 dark:text-slate-400 text-slate-600"
            />
          </button>
        </div>
        <Web3Input.Currency
          id="add-liquidity-token1"
          type="INPUT"
          className="p-3 bg-white dark:bg-slate-800 rounded-xl"
          chainId={chainId}
          value={input1}
          onChange={onChangeToken1TypedAmount}
          onSelect={setToken1}
          currency={token1}
          disabled={
            !token1 ||
            poolState === SushiSwapV2PoolState.LOADING ||
            poolState === SushiSwapV2PoolState.INVALID
          }
          loading={poolState === SushiSwapV2PoolState.LOADING}
          allowNative={isWNativeSupported(chainId)}
        />
        <AddSectionPoolShareCardV2
          pool={pool}
          poolState={poolState}
          input0={parsedInput0}
          input1={parsedInput1}
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
                            <AddSectionReviewModalLegacy
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
                                testId="add-liquidity"
                              >
                                {title}
                              </Button>
                            </AddSectionReviewModalLegacy>
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
