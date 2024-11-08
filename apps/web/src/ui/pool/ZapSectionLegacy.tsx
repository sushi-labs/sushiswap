'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { V2Pool } from '@sushiswap/graph-client/data-api'
import { SlippageToleranceStorageKey } from '@sushiswap/hooks'
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
import { FC, useMemo, useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { APPROVE_TAG_ZAP_LEGACY, NativeAddress } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import {
  SushiSwapV2PoolState,
  useSushiSwapV2Pool,
} from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import {
  SushiSwapV2ChainId,
  defaultCurrency,
  isWNativeSupported,
} from 'sushi/config'
import { Amount, Type, tryParseAmount } from 'sushi/currency'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'
import { useTokensFromPool, useZap } from '../../lib/hooks'
import { ToggleZapCard } from './ToggleZapCard'

interface ZapSectionLegacyProps {
  pool: V2Pool
  setUseZap(value: boolean): void
}

export const ZapSectionLegacy: FC<ZapSectionLegacyProps> = ({
  pool: _pool,
  setUseZap,
}) => {
  const { address } = useAccount()

  const { token0, token1 } = useTokensFromPool(_pool)
  const {
    data: [poolState, pool],
  } = useSushiSwapV2Pool(_pool.chainId as SushiSwapV2ChainId, token0, token1)

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, setInputCurrency] = useState<Type>(
    defaultCurrency[_pool.chainId as keyof typeof defaultCurrency],
  )
  const parsedInputAmount = useMemo(
    () =>
      tryParseAmount(inputAmount, inputCurrency) ||
      Amount.fromRawAmount(inputCurrency, 0),
    [inputAmount, inputCurrency],
  )

  const { data: zapResponse, isError: isZapError } = useZap({
    chainId: _pool.chainId,
    fromAddress: address,
    tokenIn: [inputCurrency.isNative ? NativeAddress : inputCurrency.address],
    amountIn: parsedInputAmount?.quotient?.toString(),
    tokenOut: pool?.liquidityToken.address,
  })

  const {
    data: estGas,
    isError: isEstimateGasError,
    isLoading: isEstimateGasLoading,
  } = useEstimateGas({
    chainId: _pool.chainId,
    account: address,
    to: zapResponse?.tx.to,
    data: zapResponse?.tx.data,
    value: zapResponse?.tx.value,
    query: {
      enabled: Boolean(address && zapResponse?.tx),
    },
  })

  const preparedTx = useMemo(() => {
    return zapResponse && estGas
      ? { ...zapResponse.tx, gas: estGas }
      : undefined
  }, [zapResponse, estGas])

  const { sendTransaction, isPending: isWritePending } = useSendTransaction()

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
      {isZapSupportedChainId(_pool.chainId) ? (
        <div className="mb-4">
          <ToggleZapCard onCheckedChange={setUseZap} checked={true} />
        </div>
      ) : null}
      <Web3Input.Currency
        id="zap-liquidity-token"
        type="INPUT"
        className="border border-accent px-3 py-1.5 !rounded-xl"
        chainId={_pool.chainId}
        value={inputAmount}
        onChange={setInputAmount}
        onSelect={setInputCurrency}
        currency={inputCurrency}
        disabled={
          poolState === SushiSwapV2PoolState.LOADING ||
          poolState === SushiSwapV2PoolState.INVALID
        }
        loading={poolState === SushiSwapV2PoolState.LOADING}
        allowNative={isWNativeSupported(_pool.chainId)}
      />
      <WidgetFooter>
        <CheckerProvider>
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={_pool.chainId}>
              <Checker.Amounts
                fullWidth
                chainId={_pool.chainId}
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
                      loading={isEstimateGasLoading || isWritePending}
                      disabled={isZapError || isEstimateGasError}
                    >
                      {isZapError || isEstimateGasError ? (
                        'Shoot! Something went wrong :('
                      ) : isWritePending ? (
                        <Dots>Add Liquidity</Dots>
                      ) : (
                        'Add Liquidity'
                      )}
                    </Button>
                  </Checker.Success>
                </Checker.ApproveERC20>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Connect>
        </CheckerProvider>
      </WidgetFooter>
    </Widget>
  )
}
