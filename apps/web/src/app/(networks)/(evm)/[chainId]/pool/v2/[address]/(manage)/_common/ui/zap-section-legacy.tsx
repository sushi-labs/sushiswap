'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import {
  Button,
  Dots,
  IconButton,
  SettingsModule,
  SettingsOverlay,
  Widget,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { APPROVE_TAG_ZAP_LEGACY, NativeAddress } from 'src/lib/constants'
import { useV2Zap } from 'src/lib/hooks'
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
} from 'src/lib/wagmi/systems/Checker/provider'
import { Amount, Percent } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV2ChainId,
  type SushiSwapV2Pool,
  defaultCurrency,
  isWNativeSupported,
} from 'sushi/evm'
import type { SendTransactionReturnType } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { ToggleZapCard } from '~evm/[chainId]/pool/_ui/toggle-zap-card'
import { V2ZapInfoCard } from '~evm/[chainId]/pool/v2/_common/ui/v2-zap-info-card'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface ZapSectionLegacyProps {
  chainId: SushiSwapV2ChainId
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  toggleZapMode(value: boolean): void
}

export const ZapSectionLegacy: FC<ZapSectionLegacyProps> = (props) => {
  return (
    <CheckerProvider>
      <_ZapSectionLegacy {...props} />
    </CheckerProvider>
  )
}

const _ZapSectionLegacy: FC<ZapSectionLegacyProps> = ({
  chainId,
  pool,
  poolState,
  toggleZapMode,
}) => {
  const client = usePublicClient()

  const { address, chain } = useAccount()

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, _setInputCurrency] = useState<EvmCurrency>(
    defaultCurrency[chainId as keyof typeof defaultCurrency],
  )
  const setInputCurrency = useCallback((currency: EvmCurrency) => {
    _setInputCurrency(currency)
    setInputAmount('')
  }, [])

  const parsedInputAmount = useMemo(
    () =>
      Amount.tryFromHuman(inputCurrency, inputAmount) ||
      new Amount(inputCurrency, 0),
    [inputAmount, inputCurrency],
  )

  const {
    data: zapResponse,
    isLoading: isZapLoading,
    isError: isZapError,
    error: zapError,
  } = useV2Zap({
    chainId,
    fromAddress: address,
    tokenIn:
      inputCurrency.type === 'native' ? NativeAddress : inputCurrency.address,
    amountIn: parsedInputAmount?.amount.toString(),
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
    <Widget id="zapLiquidity" variant="empty">
      <WidgetHeader>
        <WidgetTitle>Add Liquidity</WidgetTitle>
        <WidgetDescription>
          Provide liquidity to receive SLP tokens.
        </WidgetDescription>
        <WidgetAction variant="empty">
          <SettingsOverlay
            options={{
              slippageTolerance: {
                storageKey: SlippageToleranceStorageKey.AddLiquidity,
                title: 'Add Liquidity Slippage',
              },
            }}
            modules={[
              SettingsModule.CustomTokens,
              SettingsModule.SlippageTolerance,
            ]}
          >
            <IconButton
              size="sm"
              name="Settings"
              icon={Cog6ToothIcon}
              variant="secondary"
            />
          </SettingsOverlay>
        </WidgetAction>
      </WidgetHeader>
      <div className="mb-4">
        <ToggleZapCard onCheckedChange={toggleZapMode} checked={true} />
      </div>
      <Web3Input.Currency
        id="zap-liquidity-token"
        type="INPUT"
        className="p-4 bg-gray-100 dark:bg-slate-800 rounded-xl"
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
      <WidgetFooter>
        <div className="flex flex-col gap-4 w-full">
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
                    text="Zap With High Slippage"
                    slippageTolerance={slippageTolerance}
                    fullWidth
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
                            'Add Liquidity'
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
          <V2ZapInfoCard
            zapResponse={zapResponse}
            isZapError={isZapError}
            inputCurrencyAmount={parsedInputAmount}
            pool={pool}
          />
        </div>
      </WidgetFooter>
    </Widget>
  )
}
