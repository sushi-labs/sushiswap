'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
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
import { APPROVE_TAG_ZAP_LEGACY, NativeAddress } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import {
  SushiSwapV2ChainId,
  defaultCurrency,
  isWNativeSupported,
} from 'sushi/config'
import { Amount, Type, tryParseAmount } from 'sushi/currency'
import { SushiSwapV2Pool } from 'sushi/pool'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'
import { useZap } from '../../lib/hooks'
import { ToggleZapCard } from './ToggleZapCard'
import { ZapInfoCard } from './ZapInfoCard'

interface ZapSectionLegacyProps {
  chainId: SushiSwapV2ChainId
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  setUseZap(value: boolean): void
}

export const ZapSectionLegacy: FC<ZapSectionLegacyProps> = ({
  chainId,
  pool,
  poolState,
  setUseZap,
}) => {
  const { address } = useAccount()

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, setInputCurrency] = useState<Type>(
    defaultCurrency[chainId as keyof typeof defaultCurrency],
  )
  const parsedInputAmount = useMemo(
    () =>
      tryParseAmount(inputAmount, inputCurrency) ||
      Amount.fromRawAmount(inputCurrency, 0),
    [inputAmount, inputCurrency],
  )

  const { data: zapResponse, isError: isZapError } = useZap({
    chainId,
    fromAddress: address,
    tokenIn: inputCurrency.isNative ? NativeAddress : inputCurrency.address,
    amountIn: parsedInputAmount?.quotient?.toString(),
    tokenOut: pool?.liquidityToken.address,
  })

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    chainId,
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
      <div className="mb-4">
        <ToggleZapCard onCheckedChange={setUseZap} checked={true} />
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
          <CheckerProvider>
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
                        onClick={() =>
                          preparedTx && sendTransaction(preparedTx)
                        }
                        loading={!preparedTx || isWritePending}
                        disabled={isZapError || isEstGasError}
                      >
                        {isZapError || isEstGasError ? (
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
          <ZapInfoCard
            zapResponse={zapResponse}
            inputCurrency={inputCurrency}
            pool={pool}
          />
        </div>
      </WidgetFooter>
    </Widget>
  )
}
