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
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { APPROVE_TAG_ZAP_LEGACY, NativeAddress } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  CheckerProvider,
  useApproved,
} from 'src/lib/wagmi/systems/Checker/Provider'
import {
  SushiSwapV2ChainId,
  defaultCurrency,
  isWNativeSupported,
} from 'sushi/config'
import { Amount, Type, tryParseAmount } from 'sushi/currency'
import { SushiSwapV2Pool } from 'sushi/pool'
import { SendTransactionReturnType } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { useZap } from '../../lib/hooks'
import { ToggleZapCard } from './ToggleZapCard'
import { ZapInfoCard } from './ZapInfoCard'

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
      {
        if (receipt.status === 'success') {
          sendAnalyticsEvent(ZapEventName.ZAP_TRANSACTION_COMPLETED, {
            txHash: hash,
            from: receipt.from,
            chain_id: chainId,
          })
        } else {
          sendAnalyticsEvent(ZapEventName.ZAP_TRANSACTION_FAILED, {
            txHash: hash,
            from: receipt.from,
            chain_id: chainId,
          })
        }
      }
    },
    [refetchBalances, client, chain, address, pool],
  )

  const { sendTransaction, isPending: isWritePending } = useSendTransaction({
    mutation: { onSuccess },
  })

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
        className="border border-accent px-3 py-1.5 !rounded-xl"
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
                        'Add Liquidity'
                      )}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
          <ZapInfoCard
            zapResponse={zapResponse}
            inputCurrencyAmount={parsedInputAmount}
            pool={pool}
          />
        </div>
      </WidgetFooter>
    </Widget>
  )
}
