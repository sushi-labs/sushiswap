'use client'

import { VaultV1 } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { ZapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { Button, Dots } from '@sushiswap/ui'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { APPROVE_TAG_ZAP_STEER, NativeAddress } from 'src/lib/constants'
import { useZap } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  CheckerProvider,
  useApproved,
} from 'src/lib/wagmi/systems/Checker/Provider'
import { ZapInfoCard } from 'src/ui/pool/ZapInfoCard'
import { defaultCurrency, isWNativeSupported } from 'sushi/config'
import { Amount, Type, tryParseAmount } from 'sushi/currency'
import { SendTransactionReturnType } from 'viem'
import {
  useAccount,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'

interface SteerPositionZapProps {
  vault: VaultV1
  tokenRatios?: { token0: number; token1: number }
}

export const SteerPositionZap: FC<SteerPositionZapProps> = (props) => {
  return (
    <CheckerProvider>
      <_SteerPositionZap {...props} />
    </CheckerProvider>
  )
}

const _SteerPositionZap: FC<SteerPositionZapProps> = ({
  vault,
  tokenRatios,
}) => {
  const client = usePublicClient()

  const { address, chain } = useAccount()

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddSteerLiquidity,
  )

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, _setInputCurrency] = useState<Type>(
    defaultCurrency[vault.chainId as keyof typeof defaultCurrency],
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
    chainId: vault.chainId,
    fromAddress: address,
    tokenIn: inputCurrency.isNative ? NativeAddress : inputCurrency.address,
    amountIn: parsedInputAmount?.quotient?.toString(),
    tokenOut: vault.address,
    slippage: slippageTolerance,
  })

  useEffect(() => {
    if (!zapError) return

    sendAnalyticsEvent(ZapEventName.ZAP_ERROR, {
      error: zapError.message,
    })
  }, [zapError])

  const { approved } = useApproved(APPROVE_TAG_ZAP_STEER)

  const {
    data: estGas,
    isError: isEstGasError,
    error: estGasError,
  } = useEstimateGas({
    chainId: vault.chainId,
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
      if (!chain) return

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
          pending: `Zapping into the ${vault.token0.symbol}/${vault.token1.symbol} smart pool`,
          completed: `Successfully zapped into the ${vault.token0.symbol}/${vault.token1.symbol} smart pool`,
          failed: `Something went wrong when zapping into the ${vault.token0.symbol}/${vault.token1.symbol} smart pool`,
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
            chain_id: vault.chainId,
          })
        } else {
          sendAnalyticsEvent(ZapEventName.ZAP_TRANSACTION_FAILED, {
            txHash: hash,
            from: receipt.from,
            chain_id: vault.chainId,
          })
        }
      }
    },
    [refetchBalances, client, chain, address, vault],
  )

  const { sendTransaction, isPending: isWritePending } = useSendTransaction({
    mutation: {
      onSuccess,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <Web3Input.Currency
        id="zap-liquidity-token"
        type="INPUT"
        className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
        chainId={vault.chainId}
        value={inputAmount}
        onChange={setInputAmount}
        onSelect={setInputCurrency}
        currency={inputCurrency}
        allowNative={isWNativeSupported(vault.chainId)}
      />
      <Checker.Guard
        guardWhen={vault.isDeprecated}
        guardText="Vault is deprecated"
      >
        <Checker.Connect testId="connect" fullWidth>
          <Checker.Network
            testId="switch-network"
            fullWidth
            chainId={vault.chainId}
          >
            <Checker.Amounts
              testId="check-amounts"
              fullWidth
              chainId={vault.chainId}
              amount={parsedInputAmount}
            >
              <Checker.ApproveERC20
                fullWidth
                id="approve-erc20-0"
                amount={parsedInputAmount}
                contract={zapResponse?.tx.to}
              >
                <Checker.Success tag={APPROVE_TAG_ZAP_STEER}>
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
      </Checker.Guard>
      <ZapInfoCard
        zapResponse={zapResponse}
        inputCurrencyAmount={parsedInputAmount}
        pool={vault}
        tokenRatios={tokenRatios}
      />
    </div>
  )
}
