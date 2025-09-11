'use client'

import { Transition } from '@headlessui/react'
import { LockClosedIcon, PlusIcon } from '@heroicons/react-v1/solid'
import {
  DialogTrigger,
  Dots,
  FormSection,
  Message,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import {
  type FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  type EvmCurrency,
  type Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
  type SushiSwapV3FeeAmount,
  TickMath,
  defaultCurrency,
  isWNativeSupported,
} from 'sushi/evm'

import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { isZapSupportedChainId } from 'src/config'
import { APPROVE_TAG_ZAP_LEGACY, Bound, Field } from 'src/lib/constants'
import { useV3Zap } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionOwner'
import {
  Checker,
  SLIPPAGE_WARNING_THRESHOLD,
} from 'src/lib/wagmi/systems/Checker'
import {
  useApproved,
  withCheckerRoot,
} from 'src/lib/wagmi/systems/Checker/provider'
import { Amount, Percent } from 'sushi'
import type { SendTransactionReturnType } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import {
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { ToggleZapCard } from '../../_ui/toggle-zap-card'
import { AddSectionReviewModalConcentrated } from './add-section-review-modal-concentrated'
import { V3ZapInfoCard } from './v3-zap-info-card'

interface ConcentratedLiquidityWidget {
  chainId: SushiSwapV3ChainId
  account: string | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
  setToken0?(token: EvmCurrency): void
  setToken1?(token: EvmCurrency): void
  tokensLoading: boolean
  tokenId: number | string | undefined
  existingPosition: Position | undefined
  onChange?(val: string, input: 'a' | 'b'): void
  successLink?: string
  withTitleAndDescription?: boolean
}

export const ConcentratedLiquidityWidget: FC<ConcentratedLiquidityWidget> = (
  props,
) => {
  const {
    chainId,
    account,
    feeAmount,
    token0,
    token1,
    tokenId,
    existingPosition,
    withTitleAndDescription = true,
  } = props

  const [isZapModeEnabled, setIsZapModeEnabled] = useState(false)

  const { data: owner, isInitialLoading: isOwnerLoading } =
    useConcentratedPositionOwner({
      chainId,
      tokenId,
    })

  const isOwner = owner === account

  const derivedMintInfo = useConcentratedDerivedMintInfo({
    chainId,
    account,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition,
  })

  // An arbitrarily picked threshold to show a warning when the current price is close to the min or max tick
  const extremeTickBound = useMemo(() => {
    const tickCurrent = derivedMintInfo.pool?.tickCurrent
    if (!tickCurrent) return undefined

    const closeToMinTick =
      tickCurrent <= TickMath.MIN_TICK + 1500 ? Bound.LOWER : undefined
    const closeToMaxTick =
      tickCurrent >= TickMath.MAX_TICK - 1500 ? Bound.UPPER : undefined

    return closeToMinTick ?? closeToMaxTick ?? undefined
  }, [derivedMintInfo.pool])

  const { outOfRange, invalidRange, pool } = derivedMintInfo

  const isZapSupported = Boolean(
    isZapSupportedChainId(chainId) && !existingPosition && !tokenId && pool,
  )

  useEffect(() => {
    if (isZapSupported) {
      setIsZapModeEnabled(true)
    } else {
      setIsZapModeEnabled(false)
    }
  }, [isZapSupported])

  const widget = (
    <div className={classNames('flex flex-col gap-4')}>
      {!!existingPosition && !isOwner && !isOwnerLoading ? (
        <Message size="sm" variant="destructive">
          You are not the owner of this LP position. You will not be able to
          withdraw the liquidity from this position unless you own the following
          address: {owner}
        </Message>
      ) : null}
      {outOfRange ? (
        <Message size="sm" variant="warning">
          Your position will not earn fees or be used in trades until the market
          price moves into your range.
        </Message>
      ) : null}

      {invalidRange ? (
        <Message size="sm" variant="warning">
          Invalid range selected. The minimum price must be lower than the
          maximum price.
        </Message>
      ) : null}

      {isZapSupported ? (
        <ToggleZapCard
          checked={isZapModeEnabled}
          onCheckedChange={setIsZapModeEnabled}
        />
      ) : null}

      {extremeTickBound ? (
        <Message size="sm" variant="warning">
          The pool's current price is close to the{' '}
          {extremeTickBound === Bound.LOWER ? 'minimum' : 'maximum'} allowed by
          the protocol. It might not reflect the true market price and could
          lead to a loss of funds if liquidity is provided. Please double-check
          if the price is accurate before proceeding.
        </Message>
      ) : null}

      {isZapModeEnabled ? (
        <ZapWidgetContent
          {...props}
          isLoading={isOwnerLoading || derivedMintInfo.isInitialLoading}
          derivedMintInfo={derivedMintInfo}
        />
      ) : (
        <WidgetContent
          {...props}
          isLoading={isOwnerLoading || derivedMintInfo.isInitialLoading}
          derivedMintInfo={derivedMintInfo}
        />
      )}
    </div>
  )

  if (withTitleAndDescription)
    return (
      <FormSection
        title="Liquidity"
        description="Depending on your range, the supplied tokens for this position will not always be a 50:50 ratio."
      >
        {widget}
      </FormSection>
    )

  return widget
}

interface WidgetContentProps extends ConcentratedLiquidityWidget {
  derivedMintInfo: ReturnType<typeof useConcentratedDerivedMintInfo>
  isLoading: boolean
}

const WidgetContent: FC<WidgetContentProps> = ({
  chainId,
  feeAmount,
  token0,
  token1,
  setToken0,
  setToken1,
  tokensLoading,
  tokenId,
  existingPosition,
  onChange,
  successLink,
  derivedMintInfo: {
    dependentField,
    parsedAmounts,
    noLiquidity,
    depositADisabled,
    depositBDisabled,
    ticks,
    invalidPool,
    invalidRange,
    position,
    price,
    ticksAtLimit,
    pricesAtTicks,
  },
  isLoading,
}) => {
  const [slippagePercent] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()
  const { independentField, typedValue } = useConcentratedMintState()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const _onFieldAInput = useCallback(
    (val: string) => {
      onFieldAInput(val, noLiquidity)
      if (onChange) {
        onChange(val, 'a')
      }
    },
    [noLiquidity, onChange, onFieldAInput],
  )

  const _onFieldBInput = useCallback(
    (val: string) => {
      onFieldBInput(val, noLiquidity)
      if (onChange) {
        onChange(val, 'b')
      }
    },
    [noLiquidity, onChange, onFieldBInput],
  )

  const amounts = useMemo(() => {
    const amounts = []
    if (!depositADisabled) amounts.push(parsedAmounts[Field.CURRENCY_A])
    if (!depositBDisabled) amounts.push(parsedAmounts[Field.CURRENCY_B])
    return amounts
  }, [depositADisabled, depositBDisabled, parsedAmounts])
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  return (
    <div
      className={classNames(
        !isLoading &&
          (tickLower === undefined ||
            tickUpper === undefined ||
            invalidPool ||
            invalidRange)
          ? 'opacity-40 pointer-events-none'
          : '',
        'flex flex-col gap-4',
      )}
    >
      <div className="relative">
        {depositADisabled && !depositBDisabled ? (
          <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-sm font-medium text-center">
              <LockClosedIcon
                width={24}
                height={24}
                className="text-gray-400 dark:text-slate-400 text-slate-600"
              />
              <span className="dark:text-slate-400 text-slate-600">
                The market price is outside your specified price range.
                Single-asset deposit only.{' '}
                <a
                  // TODO
                  href="https://www.sushi.com/academy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue hover:text-blue-600"
                >
                  Learn More
                </a>
              </span>
            </div>
          </div>
        ) : null}
        <Web3Input.Currency
          id="add-liquidity-token0"
          type="INPUT"
          className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
          chainId={chainId}
          value={formattedAmounts[Field.CURRENCY_A]}
          onChange={_onFieldAInput}
          onSelect={setToken0}
          currency={token0}
          disabled={depositADisabled}
          loading={tokensLoading || isLoading}
          allowNative={isWNativeSupported(chainId)}
        />
      </div>
      <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
        <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
          <PlusIcon width={16} height={16} className="text-muted-foreground" />
        </div>
      </div>
      <div className="relative">
        <Transition
          as={Fragment}
          show={depositBDisabled && !depositADisabled}
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <div className="bg-gray-200 dark:bg-slate-800 absolute inset-0 z-[1] rounded-xl flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-sm font-medium text-center">
              <LockClosedIcon
                width={24}
                height={24}
                className="text-gray-400 dark:text-slate-400 text-slate-600"
              />
              <span className="dark:text-slate-400 text-slate-600">
                The market price is outside your specified price range.
                Single-asset deposit only.{' '}
                <a
                  // TODO
                  href="https://www.sushi.com/academy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue hover:text-blue-600"
                >
                  Learn More
                </a>
              </span>
            </div>
          </div>
        </Transition>
        <Web3Input.Currency
          id="add-liquidity-token1"
          type="INPUT"
          className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
          chainId={chainId}
          value={formattedAmounts[Field.CURRENCY_B]}
          onChange={_onFieldBInput}
          onSelect={setToken1}
          currency={token1}
          loading={tokensLoading || isLoading}
          disabled={depositBDisabled}
          allowNative={isWNativeSupported(chainId)}
        />
      </div>

      <Checker.Connect fullWidth>
        <Checker.Network fullWidth chainId={chainId}>
          <Checker.Amounts fullWidth chainId={chainId} amounts={amounts}>
            <Checker.Slippage
              fullWidth
              slippageTolerance={slippagePercent}
              text="Continue With High Slippage"
            >
              <Checker.ApproveERC20
                fullWidth
                id="approve-erc20-0"
                amount={parsedAmounts[Field.CURRENCY_A]}
                contract={SUSHISWAP_V3_POSITION_MANAGER[chainId]}
                enabled={!depositADisabled}
              >
                <Checker.ApproveERC20
                  fullWidth
                  id="approve-erc20-1"
                  amount={parsedAmounts[Field.CURRENCY_B]}
                  contract={SUSHISWAP_V3_POSITION_MANAGER[chainId]}
                  enabled={!depositBDisabled}
                >
                  <AddSectionReviewModalConcentrated
                    chainId={chainId}
                    feeAmount={feeAmount}
                    token0={token0}
                    token1={token1}
                    input0={parsedAmounts[Field.CURRENCY_A]}
                    input1={parsedAmounts[Field.CURRENCY_B]}
                    position={position}
                    noLiquidity={noLiquidity}
                    price={price}
                    pricesAtTicks={pricesAtTicks}
                    ticksAtLimit={ticksAtLimit}
                    tokenId={tokenId}
                    existingPosition={existingPosition}
                    onSuccess={() => {
                      _onFieldAInput('')
                      _onFieldBInput('')
                    }}
                    successLink={successLink}
                  >
                    <DialogTrigger asChild>
                      <Button
                        fullWidth
                        size="xl"
                        testId="add-liquidity-preview"
                      >
                        Preview
                      </Button>
                    </DialogTrigger>
                  </AddSectionReviewModalConcentrated>
                </Checker.ApproveERC20>
              </Checker.ApproveERC20>
            </Checker.Slippage>
          </Checker.Amounts>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
}

const ZapWidgetContent = withCheckerRoot(
  ({
    chainId,
    tokensLoading,
    derivedMintInfo: {
      ticks,
      invalidPool,
      invalidRange,
      depositADisabled,
      depositBDisabled,
      pool,
    },
    isLoading,
  }: WidgetContentProps) => {
    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

    const client = usePublicClient()

    const { address, chain } = useAccount()

    const [slippageTolerance] = useSlippageTolerance(
      SlippageToleranceStorageKey.AddLiquidity,
    )

    const [inputAmount, setInputAmount] = useState('')
    const [inputCurrency, _setInputCurrency] = useState<EvmCurrency>(
      defaultCurrency[chainId],
    )

    const setInputCurrency = useCallback((currency: EvmCurrency) => {
      _setInputCurrency(currency)
      setInputAmount('')
    }, [])

    const parsedInputAmount = useMemo(
      () =>
        Amount.tryFromHuman(inputCurrency, inputAmount) ||
        new Amount(inputCurrency, 0n),
      [inputAmount, inputCurrency],
    )

    const {
      data: zapResponse,
      isLoading: isZapLoading,
      isError: isZapError,
      error: zapError,
    } = useV3Zap({
      chainId,
      sender: address,
      amountIn: parsedInputAmount,
      slippage: slippageTolerance,
      ticks: tickLower && tickUpper ? [tickLower, tickUpper] : undefined,
      pool: pool || undefined,
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
            pending: `Zapping into the ${pool.token0.symbol}/${pool.token1.symbol} pool`,
            completed: `Successfully zapped into the ${pool.token0.symbol}/${pool.token1.symbol} pool`,
            failed: `Something went wrong when zapping into the ${pool.token0.symbol}/${pool.token1.symbol} pool`,
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
          ? new Percent({
              numerator: zapResponse.priceImpact,
              denominator: 10_000n,
            })
          : undefined,
      )
      return priceImpactSeverity > 3
    }, [zapResponse?.priceImpact])

    const showSlippageWarning = useMemo(() => {
      return !slippageTolerance.lt(SLIPPAGE_WARNING_THRESHOLD)
    }, [slippageTolerance])

    return (
      <div
        className={classNames(
          !isLoading &&
            (tickLower === undefined ||
              tickUpper === undefined ||
              invalidPool ||
              invalidRange)
            ? 'opacity-40 pointer-events-none'
            : '',
          'flex flex-col gap-4',
        )}
      >
        <Web3Input.Currency
          id="zap-liquidity-token"
          type="INPUT"
          className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
          chainId={chainId}
          value={inputAmount}
          onChange={setInputAmount}
          onSelect={setInputCurrency}
          currency={inputCurrency}
          disabled={depositADisabled && depositBDisabled}
          loading={tokensLoading || isLoading}
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
                        onClick={() =>
                          preparedTx && sendTransaction(preparedTx)
                        }
                        loading={isZapLoading || isWritePending}
                        disabled={!preparedTx}
                      >
                        {isZapError ? (
                          'No route found'
                        ) : isEstGasError ? (
                          'Shoot! Something went wrong :('
                        ) : isWritePending ? (
                          <Dots>Confirm Transaction</Dots>
                        ) : (
                          'Confirm Transaction'
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
        <V3ZapInfoCard
          zapResponse={zapResponse}
          isZapError={isZapError}
          inputCurrencyAmount={parsedInputAmount}
          pool={pool || null}
        />
      </div>
    )
  },
)
