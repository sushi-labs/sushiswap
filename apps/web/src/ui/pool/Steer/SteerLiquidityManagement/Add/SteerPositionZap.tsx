'use client'

import { VaultV1 } from '@sushiswap/graph-client/data-api'
import { Button, Dots } from '@sushiswap/ui'
import React, { FC, useMemo, useState } from 'react'
import { APPROVE_TAG_ZAP_STEER, NativeAddress } from 'src/lib/constants'
import { useZap } from 'src/lib/hooks'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { defaultCurrency, isWNativeSupported } from 'sushi/config'
import { Amount, Type, tryParseAmount } from 'sushi/currency'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'

interface SteerPositionAddProps {
  vault: VaultV1
}

export const SteerPositionZap: FC<SteerPositionAddProps> = ({ vault }) => {
  const { address } = useAccount()

  const [inputAmount, setInputAmount] = useState('')
  const [inputCurrency, setInputCurrency] = useState<Type>(
    defaultCurrency[vault.chainId as keyof typeof defaultCurrency],
  )
  const parsedInputAmount = useMemo(
    () =>
      tryParseAmount(inputAmount, inputCurrency) ||
      Amount.fromRawAmount(inputCurrency, 0),
    [inputAmount, inputCurrency],
  )

  const { data: zapResponse, isError: isZapError } = useZap({
    chainId: vault.chainId,
    fromAddress: address,
    tokenIn: inputCurrency.isNative ? NativeAddress : inputCurrency.address,
    amountIn: parsedInputAmount?.quotient?.toString(),
    tokenOut: vault.address,
  })

  const { data: estGas, isError: isEstGasError } = useEstimateGas({
    chainId: vault.chainId,
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
      <CheckerProvider>
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
        </Checker.Guard>
      </CheckerProvider>
    </div>
  )
}
