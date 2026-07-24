import { createToast } from '@sushiswap/notifications'
import {
  Button,
  Currency,
  Dots,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type UseEvmTradeReturn,
  useCrossChainTradeRoutes,
  useCrossChainTradeStep,
  useEvmTrade,
  useEvmTradeQuote,
} from 'src/lib/hooks/react-query'
import { useLiFiStatus } from 'src/lib/swap/cross-chain'
import { useMyTokens } from 'src/lib/wagmi/components/token-selector/hooks/use-my-tokens'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import { useAccount } from 'src/lib/wallet'
import {
  Amount,
  type Fraction,
  Percent,
  ZERO,
  formatNumber,
  formatUSD,
  getChainById,
  getNativeAddress,
} from 'sushi'
import {
  DEFAULT_SLIPPAGE,
  EvmChainId,
  type EvmCurrency,
  RED_SNWAPPER_ADDRESS,
  USDC,
  addGasMargin,
  isRedSnwapperChainId,
} from 'sushi/evm'
import {
  useEstimateGas,
  useGasPrice,
  usePublicClient,
  useSendTransaction,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { Step } from '~evm/api/cross-chain/schemas'
import { InputWithKeyboard } from '../../_common'
import { PerpsChecker } from '../../perps-checker'
import type { AnyTokenDepositOption } from './deposit-dialog'
import { USDCOptions, getMinDepositAmount, getUSDCArgs } from './usdc-options'

type TokenToSwap = {
  currency: EvmCurrency
  balance: Amount<EvmCurrency> | undefined
  price: Fraction | undefined
  usd: string | undefined
}

type SameChainAnyTokenDepositOption = Extract<
  AnyTokenDepositOption,
  { type: 'any-token' }
>

type AnyTokenAnyChainDepositOption = Extract<
  AnyTokenDepositOption,
  { type: 'any-token-any-chain' }
>

type RobinhoodToArbitrumStep = Step<
  typeof EvmChainId.ROBINHOOD,
  typeof EvmChainId.ARBITRUM,
  'lifi'
>

type RobinhoodToArbitrumRoute = {
  step: RobinhoodToArbitrumStep
  amountIn: Amount<CurrencyFor<typeof EvmChainId.ROBINHOOD>>
  amountOut: Amount<CurrencyFor<typeof EvmChainId.ARBITRUM>>
  amountOutMin: Amount<CurrencyFor<typeof EvmChainId.ARBITRUM>>
}

const SLIPPAGE = new Percent({
  numerator: Math.floor(Number(DEFAULT_SLIPPAGE) * 100),
  denominator: 10_000,
})

const ANY_CHAIN_DEPOSIT_CHAIN_ID = EvmChainId.ARBITRUM
const ANY_CHAIN_TO_TOKEN = USDC[ANY_CHAIN_DEPOSIT_CHAIN_ID]
const APPROVE_CROSS_CHAIN_TAG = 'approve-cross-chain'

function toBigInt(value: bigint | `0x${string}` | string | undefined) {
  if (value == null) return undefined
  return typeof value === 'bigint' ? value : BigInt(value)
}

const toToken = (chainId: SameChainAnyTokenDepositOption['chainId']) => {
  switch (chainId) {
    case EvmChainId.ARBITRUM:
      return USDC[EvmChainId.ARBITRUM]
    default:
      return undefined
  }
}

export const AnyTokenDeposit = ({
  depositOption,
  setOpen,
}: {
  depositOption: AnyTokenDepositOption
  setOpen: (open: boolean) => void
}) => {
  if (depositOption.type === 'any-token-any-chain') {
    return (
      <AnyTokenAnyChainDeposit
        depositOption={depositOption}
        setOpen={setOpen}
      />
    )
  }

  return (
    <SameChainAnyTokenDeposit depositOption={depositOption} setOpen={setOpen} />
  )
}

const SameChainAnyTokenDeposit = ({
  depositOption,
  setOpen,
}: {
  depositOption: SameChainAnyTokenDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [token, setToken] = useState<TokenToSwap | undefined>(undefined)
  const [swapAmount, setSwapAmount] = useState<string>('')
  const _amount = useMemo(
    () =>
      token && token.currency.chainId === depositOption.chainId
        ? Amount.tryFromHuman(token.currency, swapAmount)
        : undefined,
    [swapAmount, token, depositOption.chainId],
  )
  const { data: gasPrice } = useGasPrice({ chainId: depositOption.chainId })
  const client = usePublicClient({ chainId: depositOption.chainId })
  const { mutateAsync: writeContractAsync, isPending: isWriteContractPending } =
    useWriteContract()
  const address = useAccount('evm')
  const tradeRef = useRef<UseEvmTradeReturn | null>(null)

  const tradeArgs = useMemo(() => {
    return {
      chainId: depositOption.chainId,
      fromToken: token?.currency,
      toToken: toToken(depositOption.chainId),
      amount: _amount,
      slippagePercentage: SLIPPAGE.toString({ fixed: 2 }),
      gasPrice,
      recipient: address,
      enabled: Boolean(_amount?.gt(ZERO) && token?.currency),
      carbonOffset: false,
    }
  }, [token, _amount, gasPrice, address, depositOption.chainId])

  const { data: tradeQuote, isLoading: isLoadingTradeQuote } = useEvmTradeQuote(
    !token?.currency ? undefined : tradeArgs,
  )

  const { data: tradeData, isLoading: isLoadingTrade } = useEvmTrade({
    ...tradeArgs,
    enabled: Boolean(
      tradeQuote?.status === 'Success' &&
        tradeQuote?.amountOut?.gt(ZERO) &&
        !isLoadingTradeQuote,
    ),
  })

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const { data: pricesMap } = usePrices({
    chainId: depositOption.chainId,
  })

  const { data: tokenData, isLoading: isMyTokensLoading } = useMyTokens({
    account: address,
    chainId: depositOption.chainId,
    includeNative: true,
  })

  const currencies = useMemo(() => {
    if (!tokenData) return []
    const balancesMap = tokenData.balanceMap
    return tokenData?.tokens?.map((currency) => {
      const balance = balancesMap?.get(
        currency.type === 'native'
          ? getNativeAddress(currency.chainId)
          : currency.address,
      )
      const price = pricesMap?.getFraction(currency.wrap().address)
      const usd = balance?.mul(price || 0n)?.toString({ fixed: 2 })
      return {
        currency,
        balance,
        price,
        usd,
      }
    })
  }, [tokenData, pricesMap])

  useEffect(() => {
    if (
      (!token || token.currency.chainId !== depositOption.chainId) &&
      currencies?.length
    ) {
      setToken(currencies[0])
      setSwapAmount('')
      setStep(0)
    }
  }, [token, currencies, depositOption.chainId])

  const { mutateAsync: sendTransactionAsync, isPending: isSwapPending } =
    useSendTransaction({
      mutation: {
        onMutate: () => {
          if (tradeRef && tradeData) {
            tradeRef.current = tradeData
          }
        },
      },
    })
  const swap = useCallback(async () => {
    if (
      !tradeData?.tx ||
      address?.toLowerCase() !== tradeData.tx.from.toLowerCase()
    ) {
      return undefined
    }
    try {
      const hash = await sendTransactionAsync({
        to: tradeData.tx.to,
        data: tradeData.tx.data,
        value: tradeData.tx.value,
        gas: tradeData.tx.gas
          ? addGasMargin(BigInt(tradeData.tx.gas))
          : undefined,
      })
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      const trade = tradeRef.current
      void createToast({
        account: address,
        type: 'swap',
        chainId: depositOption.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Swapping ${trade?.amountIn?.toSignificant(6)} ${
            token?.currency.symbol
          } for ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          completed: `Swapped ${trade?.amountIn?.toSignificant(6)} ${
            trade?.amountIn?.currency.symbol
          } for ${trade?.amountOut?.toSignificant(6)} ${
            trade?.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to swap ${trade?.amountIn?.currency.symbol} for ${trade?.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })
      const receipt = await promise
      if (receipt.status === 'success') {
        refetchBalances(depositOption.chainId)
        setStep(1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      refetchBalances(depositOption.chainId)
    }
  }, [
    tradeData,
    sendTransactionAsync,
    client,
    address,
    token?.currency.symbol,
    refetchBalances,
    depositOption.chainId,
  ])

  // minAmountOut is the on-chain slippage floor, already net of the UI fee, so
  // it's always <= the USDC actually received: safe to deposit as-is (no fee or
  // buffer fudge), and guaranteed >= the bridge minimum once the gate passes.
  const transferSwapAmount = useMemo(() => {
    if (step === 0) return undefined
    return tradeRef.current?.minAmountOut
  }, [step])

  const depositArgs = useMemo(() => {
    if (!tradeRef.current?.amountOut || step === 0 || !transferSwapAmount)
      return undefined
    return getUSDCArgs({
      chainId: depositOption.chainId,
      amount: transferSwapAmount?.amount,
    })
  }, [depositOption.chainId, step, transferSwapAmount])

  const { data: sim } = useSimulateContract({
    abi: depositArgs?.abi,
    chainId: depositArgs?.chainId,
    functionName: depositArgs?.functionName,
    args: depositArgs?.args,
    address: depositArgs?.address,
    query: {
      enabled: Boolean(depositArgs),
    },
  })

  const transferUsdc = useCallback(async () => {
    if (!sim?.request || !tradeRef.current?.amountOut) return
    try {
      const hash = await writeContractAsync(sim.request)
      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      const usdc = tradeRef.current?.amountOut.currency

      void createToast({
        account: address,
        type: 'send',
        chainId: usdc?.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Depositing ${transferSwapAmount?.toSignificant(6)} ${usdc.symbol}`,
          completed: `Deposited ${transferSwapAmount?.toSignificant(6)} ${usdc.symbol}. Balances will update shortly.`,
          failed: `Something went wrong depositing ${transferSwapAmount?.toSignificant(6)} ${
            usdc.symbol
          }`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })
      setStep(2)
      const res = await promise
      if (res.status === 'success') {
        refetchBalances(depositOption.chainId)
        setOpen(false)
        setSwapAmount('')
        setStep(0)
      } else {
        setStep(1)
      }
    } catch (error) {
      console.log(error)
    }
  }, [
    sim,
    writeContractAsync,
    depositOption,
    refetchBalances,
    client,
    address,
    setOpen,
    transferSwapAmount,
  ])

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={token?.currency.id}
        onValueChange={(val: string) => {
          const option = currencies?.find((c) => c.currency.id === val)
          if (option) {
            setToken(option)
            setSwapAmount('')
            setStep(0)
          }
        }}
      >
        <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
          {token ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={token.currency}
                width={20}
                height={20}
              />
              {token.currency.name} ({token.currency.symbol})
            </div>
          ) : (
            'Select a Token'
          )}
        </SelectTrigger>
        <SelectContent className="w-full !bg-black/10">
          {currencies?.map((i, idx) => (
            <SelectItem
              key={`${i.currency.id}-${idx}`}
              value={i.currency.id}
              className="font-medium !text-white gap-4 !block"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Currency.Icon
                    disableLink
                    currency={i.currency}
                    width={20}
                    height={20}
                  />
                  {i.currency.name} ({i.currency.symbol})
                </div>
                <div>
                  {formatUSD(i?.usd || '0')} (
                  {formatNumber(i.balance?.toSignificant(6) || '0')})
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {token?.currency.symbol === 'USDC' ? (
        <USDCOptions depositChainId={EvmChainId.ARBITRUM} setOpen={setOpen} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-perps-muted-70 pb-[2px]">
                Step 1 (Swap)
              </p>

              <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
                <motion.div
                  className="h-full w-full origin-left rounded-full bg-perps-blue"
                  initial={false}
                  animate={{ scaleX: step > 0 ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-perps-muted-70 pb-[2px]">
                Step 2 (Deposit)
              </p>

              <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
                <motion.div
                  className="h-full w-full origin-left rounded-full bg-perps-blue"
                  initial={false}
                  animate={{ scaleX: step > 1 ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="swap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <InputWithKeyboard
                  amount={swapAmount}
                  setAmount={!token?.currency ? () => {} : setSwapAmount}
                  balance={token?.balance}
                  currency={
                    token?.currency ||
                    (toToken(depositOption.chainId) as EvmCurrency)
                  }
                  error={undefined}
                  isLoading={isMyTokensLoading}
                  address={address}
                />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col my-4 items-center"
              >
                <Currency.Icon
                  disableLink
                  currency={
                    token?.currency ||
                    (toToken(depositOption.chainId) as EvmCurrency)
                  }
                  width={28}
                  height={28}
                />
                <p className="font-medium">Swap Successful</p>
                <p className="text-perps-muted-50 text-sm">
                  Continue to Deposit USDC into your Perps Account
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-col gap-1">
            <StatItem
              label="Max. Received"
              value={`${tradeQuote?.amountOut?.toSignificant(6) || '0.00'} ${toToken(depositOption.chainId)?.symbol || ''}`}
              isLoading={isLoadingTradeQuote}
            />
            <StatItem
              label="Min. Received"
              value={`${tradeQuote?.minAmountOut?.toSignificant(6) || '0.00'} ${toToken(depositOption.chainId)?.symbol || ''}`}
              isLoading={isLoadingTradeQuote}
            />
          </div>
          <PerpsChecker.Legal size="default" variant="perps-tertiary">
            {step === 0 ? (
              <Checker.Connect
                size="default"
                variant="perps-tertiary"
                namespace="evm"
              >
                <Checker.Network
                  size="default"
                  chainId={depositOption.chainId}
                  variant="perps-tertiary"
                >
                  <Checker.Amounts
                    size="default"
                    chainId={depositOption.chainId}
                    amount={_amount}
                    variant="perps-tertiary"
                  >
                    <Checker.Custom
                      size="default"
                      showChildren={Boolean(
                        Number(tradeQuote?.minAmountOut?.toString()) >=
                          getMinDepositAmount(depositOption.chainId),
                      )}
                      buttonText={`Minimum Deposit is ${getMinDepositAmount(depositOption.chainId)} USDC`}
                      variant="perps-tertiary"
                      onClick={() => {}}
                      disabled={
                        !tradeQuote ||
                        Number(tradeQuote?.minAmountOut?.toString()) <
                          getMinDepositAmount(depositOption.chainId)
                      }
                    >
                      <Checker.ApproveERC20
                        size="default"
                        id="approve-erc20"
                        variant="perps-tertiary"
                        amount={_amount}
                        contract={
                          isRedSnwapperChainId(depositOption.chainId)
                            ? RED_SNWAPPER_ADDRESS[depositOption.chainId]
                            : undefined
                        }
                      >
                        <Checker.Success tag="approve-erc20">
                          <Checker.PartialRoute
                            size="default"
                            variant="perps-tertiary"
                            trade={tradeQuote}
                            setSwapAmount={setSwapAmount}
                            canContinue={
                              tradeData?.status === 'Success' &&
                              tradeData.amountIn?.toString() ===
                                tradeQuote?.amountIn?.toString()
                            }
                            onAccepted={swap}
                          >
                            <Button
                              variant="perps-tertiary"
                              size="default"
                              disabled={!tradeData}
                              className="w-full"
                              onClick={swap}
                              loading={isSwapPending || isLoadingTrade}
                            >
                              Swap
                            </Button>
                          </Checker.PartialRoute>
                        </Checker.Success>
                      </Checker.ApproveERC20>
                    </Checker.Custom>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Connect>
            ) : (
              <Button
                variant="perps-tertiary"
                size="default"
                disabled={
                  !sim?.request ||
                  !transferSwapAmount ||
                  Number(transferSwapAmount.toString()) <
                    getMinDepositAmount(depositOption.chainId)
                }
                className="w-full"
                onClick={transferUsdc}
                loading={isWriteContractPending}
              >
                Deposit
              </Button>
            )}
          </PerpsChecker.Legal>
        </>
      )}
    </div>
  )
}

const AnyTokenAnyChainDeposit = ({
  depositOption,
  setOpen,
}: {
  depositOption: AnyTokenAnyChainDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [token, setToken] = useState<TokenToSwap | undefined>(undefined)
  const [swapAmount, setSwapAmount] = useState<string>('')
  const [sourceTxHash, setSourceTxHash] = useState<
    TxHashFor<typeof EvmChainId.ROBINHOOD> | undefined
  >(undefined)
  const [crossChainTradeId, setCrossChainTradeId] = useState<string>('')
  const routeRef = useRef<RobinhoodToArbitrumRoute | null>(null)
  const receivingTxHashRef = useRef<
    TxHashFor<typeof EvmChainId.ARBITRUM> | undefined
  >(undefined)
  const address = useAccount('evm')
  const client = usePublicClient({ chainId: depositOption.chainId })
  const destinationClient = usePublicClient({
    chainId: ANY_CHAIN_DEPOSIT_CHAIN_ID,
  })
  const { mutateAsync: writeContractAsync, isPending: isWriteContractPending } =
    useWriteContract()
  const { refetchChain: refetchBalances } = useRefetchBalances()

  const resetCrossChainState = useCallback(() => {
    routeRef.current = null
    receivingTxHashRef.current = undefined
    setSourceTxHash(undefined)
    setCrossChainTradeId('')
    setStep(0)
  }, [])

  const _amount = useMemo(() => {
    if (!token || token.currency.chainId !== depositOption.chainId) {
      return undefined
    }

    return Amount.tryFromHuman(token.currency, swapAmount) as
      | Amount<CurrencyFor<typeof EvmChainId.ROBINHOOD>>
      | undefined
  }, [swapAmount, token, depositOption.chainId])

  const { data: pricesMap } = usePrices({
    chainId: depositOption.chainId,
  })

  const { data: tokenData, isLoading: isMyTokensLoading } = useMyTokens({
    account: address,
    chainId: depositOption.chainId,
    includeNative: true,
  })

  const currencies = useMemo(() => {
    if (!tokenData) return []
    const balancesMap = tokenData.balanceMap
    return tokenData?.tokens?.map((currency) => {
      const balance = balancesMap?.get(
        currency.type === 'native'
          ? getNativeAddress(currency.chainId)
          : currency.address,
      )
      const price = pricesMap?.getFraction(currency.wrap().address)
      const usd = balance?.mul(price || 0n)?.toString({ fixed: 2 })
      return {
        currency,
        balance,
        price,
        usd,
      }
    })
  }, [tokenData, pricesMap])

  useEffect(() => {
    if (
      (!token || token.currency.chainId !== depositOption.chainId) &&
      currencies?.length
    ) {
      setToken(currencies[0])
      setSwapAmount('')
      resetCrossChainState()
    }
  }, [token, currencies, depositOption.chainId, resetCrossChainState])

  const {
    data: routes,
    isLoading: isLoadingRoutes,
    isError: isRoutesError,
  } = useCrossChainTradeRoutes<
    typeof EvmChainId.ROBINHOOD,
    typeof EvmChainId.ARBITRUM
  >({
    fromAmount: _amount,
    toToken: ANY_CHAIN_TO_TOKEN,
    slippage: SLIPPAGE,
    fromAddress: address,
    toAddress: address,
    order: 'CHEAPEST',
  })

  const selectedRoute = useMemo(() => {
    const route = routes?.[0]
    if (!route || !_amount) return undefined

    return {
      step: route.step as RobinhoodToArbitrumStep,
      amountIn: new Amount(_amount.currency, route.fromAmount),
      amountOut: new Amount(ANY_CHAIN_TO_TOKEN, route.toAmount),
      amountOutMin: new Amount(ANY_CHAIN_TO_TOKEN, route.toAmountMin),
    } satisfies RobinhoodToArbitrumRoute
  }, [routes, _amount])

  const { approved: isCrossChainApproved } = useApproved(
    APPROVE_CROSS_CHAIN_TAG,
  )
  const shouldPrepareCrossChainTx = Boolean(
    selectedRoute &&
      !sourceTxHash &&
      (token?.currency.type === 'native' || isCrossChainApproved),
  )

  const { data: crossChainStep, isLoading: isLoadingCrossChainStep } =
    useCrossChainTradeStep<
      typeof EvmChainId.ROBINHOOD,
      typeof EvmChainId.ARBITRUM
    >({
      step: selectedRoute?.step,
      enabled: shouldPrepareCrossChainTx,
    })

  const { data: estGas, isLoading: isEstimatingGas } = useEstimateGas({
    chainId: depositOption.chainId,
    to: crossChainStep?.transactionRequest?.to,
    data: crossChainStep?.transactionRequest?.data,
    value: toBigInt(crossChainStep?.transactionRequest?.value),
    account: crossChainStep?.transactionRequest?.from,
    query: {
      enabled: Boolean(
        crossChainStep?.transactionRequest && shouldPrepareCrossChainTx,
      ),
    },
  })

  const preparedTx = useMemo(() => {
    if (!crossChainStep?.transactionRequest || !estGas) return undefined

    return {
      ...crossChainStep.transactionRequest,
      chainId: depositOption.chainId,
      gas: estGas,
      value: toBigInt(crossChainStep.transactionRequest.value),
      gasPrice: toBigInt(crossChainStep.transactionRequest.gasPrice),
    }
  }, [crossChainStep?.transactionRequest, depositOption.chainId, estGas])

  const { data: lifiStatus } = useLiFiStatus<
    typeof EvmChainId.ROBINHOOD,
    typeof EvmChainId.ARBITRUM
  >({
    txHash: sourceTxHash,
    tradeId: crossChainTradeId,
    enabled: Boolean(sourceTxHash && crossChainTradeId),
  })

  const isBridgeComplete =
    lifiStatus?.status === 'DONE' && lifiStatus.substatus === 'COMPLETED'
  const isBridgeFailed =
    lifiStatus?.status === 'FAILED' ||
    (lifiStatus?.status === 'DONE' && lifiStatus.substatus !== 'COMPLETED')
  const isBridgePending = Boolean(
    sourceTxHash && !isBridgeComplete && !isBridgeFailed,
  )
  const minDepositAmount = getMinDepositAmount(ANY_CHAIN_DEPOSIT_CHAIN_ID)
  const routeMeetsMinimum = Boolean(
    selectedRoute &&
      Number(selectedRoute.amountOutMin.toString()) >= minDepositAmount,
  )
  const hasNoRoutes = Boolean(
    _amount?.gt(ZERO) &&
      !isLoadingRoutes &&
      !isRoutesError &&
      routes?.length === 0,
  )

  useEffect(() => {
    if (!isBridgeComplete) return

    refetchBalances(ANY_CHAIN_DEPOSIT_CHAIN_ID)
    setStep(1)
  }, [isBridgeComplete, refetchBalances])

  useEffect(() => {
    if (!isBridgeFailed) return

    routeRef.current = null
    setSourceTxHash(undefined)
    setCrossChainTradeId('')
  }, [isBridgeFailed])

  useEffect(() => {
    const txHash = lifiStatus?.receiving?.txHash
    const trade = routeRef.current
    if (!txHash || receivingTxHashRef.current === txHash || !trade) return

    receivingTxHashRef.current = txHash
    const promise = destinationClient
      .waitForTransactionReceipt({
        hash: txHash,
      })
      .then((receipt) => {
        if (receipt.status === 'success') {
          refetchBalances(ANY_CHAIN_DEPOSIT_CHAIN_ID)
        }

        return receipt
      })
    const ts = new Date().getTime()
    const destinationChainName = getChainById(ANY_CHAIN_DEPOSIT_CHAIN_ID).name

    void createToast({
      account: address,
      type: 'swap',
      chainId: ANY_CHAIN_DEPOSIT_CHAIN_ID,
      txHash,
      promise,
      summary: {
        pending: `Receiving ${trade.amountOut.toSignificant(6)} ${
          trade.amountOut.currency.symbol
        } on ${destinationChainName}`,
        completed: `Received ${trade.amountOut.toSignificant(6)} ${
          trade.amountOut.currency.symbol
        } on ${destinationChainName}`,
        failed: `Something went wrong receiving ${trade.amountOut.currency.symbol} on ${destinationChainName}`,
      },
      timestamp: ts,
      groupTimestamp: ts,
      variant: 'perps',
    })
  }, [
    lifiStatus?.receiving?.txHash,
    destinationClient,
    refetchBalances,
    address,
  ])

  const { mutateAsync: sendTransactionAsync, isPending: isSwapPending } =
    useSendTransaction()

  const crossChainSwap = useCallback(async () => {
    if (
      !preparedTx ||
      !selectedRoute ||
      !crossChainStep?.transactionRequest?.from ||
      address?.toLowerCase() !==
        crossChainStep.transactionRequest.from.toLowerCase()
    ) {
      return undefined
    }

    try {
      routeRef.current = selectedRoute
      const hash = await sendTransactionAsync(
        preparedTx as Parameters<typeof sendTransactionAsync>[0],
      )
      const typedHash = hash as TxHashFor<typeof EvmChainId.ROBINHOOD>
      setSourceTxHash(typedHash)
      setCrossChainTradeId(typedHash)

      const promise = client.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()
      const destinationChainName = getChainById(ANY_CHAIN_DEPOSIT_CHAIN_ID).name

      void createToast({
        account: address,
        type: 'swap',
        chainId: depositOption.chainId,
        txHash: hash,
        promise,
        summary: {
          pending: `Sending ${selectedRoute.amountIn.toSignificant(6)} ${
            selectedRoute.amountIn.currency.symbol
          } to ${destinationChainName}`,
          completed: `Sent ${selectedRoute.amountIn.toSignificant(6)} ${
            selectedRoute.amountIn.currency.symbol
          } to ${destinationChainName}`,
          failed: `Something went wrong sending ${selectedRoute.amountIn.currency.symbol} to ${destinationChainName}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })

      const receipt = await promise
      if (receipt.status === 'success') {
        refetchBalances(depositOption.chainId)
      } else {
        routeRef.current = null
        setSourceTxHash(undefined)
        setCrossChainTradeId('')
      }
    } catch (e) {
      console.error(e)
    } finally {
      refetchBalances(depositOption.chainId)
    }
  }, [
    preparedTx,
    selectedRoute,
    crossChainStep?.transactionRequest?.from,
    address,
    sendTransactionAsync,
    client,
    depositOption.chainId,
    refetchBalances,
  ])

  const transferSwapAmount = useMemo(() => {
    if (step === 0) return undefined
    return routeRef.current?.amountOutMin
  }, [step])

  const depositArgs = useMemo(() => {
    if (!transferSwapAmount || step === 0) return undefined
    return getUSDCArgs({
      chainId: ANY_CHAIN_DEPOSIT_CHAIN_ID,
      amount: transferSwapAmount.amount,
    })
  }, [step, transferSwapAmount])

  const { data: sim } = useSimulateContract({
    abi: depositArgs?.abi,
    chainId: depositArgs?.chainId,
    functionName: depositArgs?.functionName,
    args: depositArgs?.args,
    address: depositArgs?.address,
    query: {
      enabled: Boolean(depositArgs),
    },
  })

  const transferUsdc = useCallback(async () => {
    if (!sim?.request || !transferSwapAmount) return
    try {
      const hash = await writeContractAsync(sim.request)
      const promise = destinationClient.waitForTransactionReceipt({
        hash,
      })
      const ts = new Date().getTime()

      void createToast({
        account: address,
        type: 'send',
        chainId: ANY_CHAIN_DEPOSIT_CHAIN_ID,
        txHash: hash,
        promise,
        summary: {
          pending: `Depositing ${transferSwapAmount.toSignificant(6)} ${ANY_CHAIN_TO_TOKEN.symbol}`,
          completed: `Deposited ${transferSwapAmount.toSignificant(6)} ${ANY_CHAIN_TO_TOKEN.symbol}. Balances will update shortly.`,
          failed: `Something went wrong depositing ${transferSwapAmount.toSignificant(6)} ${ANY_CHAIN_TO_TOKEN.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
        variant: 'perps',
      })
      setStep(2)
      const res = await promise
      if (res.status === 'success') {
        refetchBalances(ANY_CHAIN_DEPOSIT_CHAIN_ID)
        setOpen(false)
        setSwapAmount('')
        resetCrossChainState()
      } else {
        setStep(1)
      }
    } catch (error) {
      console.log(error)
    }
  }, [
    sim,
    transferSwapAmount,
    writeContractAsync,
    destinationClient,
    address,
    refetchBalances,
    setOpen,
    resetCrossChainState,
  ])

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={token?.currency.id}
        onValueChange={(val: string) => {
          const option = currencies?.find((c) => c.currency.id === val)
          if (option) {
            setToken(option)
            setSwapAmount('')
            resetCrossChainState()
          }
        }}
      >
        <SelectTrigger className="w-full text-sm !px-2 !h-[40px] !gap-1 !border-[#FFFFFF1A] bg-transparent !border">
          {token ? (
            <div className="flex items-center gap-1">
              <Currency.Icon
                disableLink
                currency={token.currency}
                width={20}
                height={20}
              />
              {token.currency.name} ({token.currency.symbol})
            </div>
          ) : (
            'Select a Token'
          )}
        </SelectTrigger>
        <SelectContent className="w-full !bg-black/10">
          {currencies?.map((i, idx) => (
            <SelectItem
              key={`${i.currency.id}-${idx}`}
              value={i.currency.id}
              className="font-medium !text-white gap-4 !block"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Currency.Icon
                    disableLink
                    currency={i.currency}
                    width={20}
                    height={20}
                  />
                  {i.currency.name} ({i.currency.symbol})
                </div>
                <div>
                  {formatUSD(i?.usd || '0')} (
                  {formatNumber(i.balance?.toSignificant(6) || '0')})
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-perps-muted-70 pb-[2px]">
            Step 1 (Swap & Bridge)
          </p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-perps-blue"
              initial={false}
              animate={{ scaleX: isBridgePending || step > 0 ? 1 : 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-perps-muted-70 pb-[2px]">
            Step 2 (Deposit)
          </p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-perps-muted-20">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-perps-blue"
              initial={false}
              animate={{ scaleX: step > 1 ? 1 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {step === 0 && !isBridgePending ? (
          <motion.div
            key="swap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <InputWithKeyboard
              amount={swapAmount}
              setAmount={!token?.currency ? () => {} : setSwapAmount}
              balance={token?.balance}
              currency={token?.currency || ANY_CHAIN_TO_TOKEN}
              error={undefined}
              isLoading={isMyTokensLoading}
              address={address}
            />
          </motion.div>
        ) : (
          <motion.div
            key={isBridgePending ? 'pending' : 'success'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col my-4 items-center"
          >
            <Currency.Icon
              disableLink
              currency={ANY_CHAIN_TO_TOKEN}
              width={28}
              height={28}
            />
            <p className="font-medium">
              {isBridgePending ? 'Bridge Pending' : 'Bridge Successful'}
            </p>
            <p className="text-perps-muted-50 text-sm">
              {isBridgePending ? (
                <Dots>Waiting for USDC on Arbitrum</Dots>
              ) : (
                'Continue to Deposit USDC into your Perps Account'
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-1">
        <StatItem
          label="Max. Received"
          value={`${selectedRoute?.amountOut.toSignificant(6) || '0.00'} ${ANY_CHAIN_TO_TOKEN.symbol}`}
          isLoading={isLoadingRoutes}
        />
        <StatItem
          label="Min. Received"
          value={`${selectedRoute?.amountOutMin.toSignificant(6) || '0.00'} ${ANY_CHAIN_TO_TOKEN.symbol}`}
          isLoading={isLoadingRoutes}
        />
      </div>
      <PerpsChecker.Legal size="default" variant="perps-tertiary">
        {isBridgePending ? (
          <Button
            variant="perps-tertiary"
            size="default"
            disabled
            className="w-full"
          >
            Deposit
          </Button>
        ) : step === 0 ? (
          <Checker.Connect
            size="default"
            variant="perps-tertiary"
            namespace="evm"
          >
            <Checker.Network
              size="default"
              chainId={depositOption.chainId}
              variant="perps-tertiary"
            >
              <Checker.Amounts
                size="default"
                chainId={depositOption.chainId}
                amount={_amount}
                variant="perps-tertiary"
              >
                <Checker.Custom
                  size="default"
                  showChildren={routeMeetsMinimum}
                  buttonText={
                    isLoadingRoutes
                      ? 'Loading Routes'
                      : isRoutesError || hasNoRoutes
                        ? 'No route found'
                        : `Minimum Deposit is ${minDepositAmount} USDC`
                  }
                  variant="perps-tertiary"
                  onClick={() => {}}
                  loading={isLoadingRoutes}
                  disabled={!selectedRoute || !routeMeetsMinimum || hasNoRoutes}
                >
                  <Checker.ApproveERC20
                    size="default"
                    id={APPROVE_CROSS_CHAIN_TAG}
                    variant="perps-tertiary"
                    amount={_amount}
                    contract={
                      selectedRoute?.step.estimate.approvalAddress as
                        | AddressFor<typeof EvmChainId.ROBINHOOD>
                        | undefined
                    }
                    enabled={token?.currency.type !== 'native'}
                  >
                    <Checker.Success tag={APPROVE_CROSS_CHAIN_TAG}>
                      <Button
                        variant="perps-tertiary"
                        size="default"
                        disabled={
                          !preparedTx ||
                          !selectedRoute ||
                          isBridgePending ||
                          isBridgeFailed
                        }
                        className="w-full"
                        onClick={crossChainSwap}
                        loading={
                          isSwapPending ||
                          isBridgePending ||
                          isLoadingCrossChainStep ||
                          isEstimatingGas
                        }
                      >
                        {isBridgePending ? 'Bridge Pending' : 'Swap & Bridge'}
                      </Button>
                    </Checker.Success>
                  </Checker.ApproveERC20>
                </Checker.Custom>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        ) : (
          <Checker.Connect
            size="default"
            variant="perps-tertiary"
            namespace="evm"
          >
            <Checker.Network
              size="default"
              chainId={ANY_CHAIN_DEPOSIT_CHAIN_ID}
              variant="perps-tertiary"
            >
              <Button
                variant="perps-tertiary"
                size="default"
                disabled={
                  !sim?.request ||
                  !transferSwapAmount ||
                  Number(transferSwapAmount.toString()) < minDepositAmount
                }
                className="w-full"
                onClick={transferUsdc}
                loading={isWriteContractPending}
              >
                Deposit
              </Button>
            </Checker.Network>
          </Checker.Connect>
        )}
      </PerpsChecker.Legal>
    </div>
  )
}

const StatItem = ({
  label,
  value,
  isLoading,
}: {
  label: string
  value: string
  isLoading: boolean
}) => {
  return (
    <div className="flex justify-between items-center gap-2 text-xs">
      <span className="text-perps-muted-50">{label}</span>
      <span className="font-semibold text-perps-muted text-right">
        {isLoading ? <SkeletonBox className="h-4 py-0.5 w-[100px]" /> : value}
      </span>
    </div>
  )
}
