'use client'

import { CogIcon } from '@heroicons/react-v1/solid'
import { ChainId } from '@sushiswap/chain'
import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { Amount, Token } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { Percent } from '@sushiswap/math'
import { useSteerAccountPosition } from '@sushiswap/steer-sdk/hooks'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardLabel,
  createErrorToast,
  createToast,
  IconButton,
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi'
import { useAccount, useNetwork, usePrepareSendTransaction, useSendTransaction } from '@sushiswap/wagmi'
import { Checker } from '@sushiswap/wagmi/future'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { UserRejectedRequestError } from 'viem'

interface SteerPositionRemoveProps {
  vault: SteerVault
}

export const SteerPositionRemove: FC<SteerPositionRemoveProps> = ({ vault }) => {
  const { chainId } = vault as { chainId: ChainId }

  const { chain } = useNetwork()
  const { address: account } = useAccount()
  const [value, setValue] = useState<string>('0')
  const [slippageTolerance] = useSlippageTolerance('removeSteerLiquidity')
  const debouncedValue = useDebounce(value, 300)

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const { data: position } = useSteerAccountPosition({ account: account, vaultId: vault.id })

  const [token0, token1] = useMemo(() => {
    const token0 = new Token({ chainId: chainId, ...vault.pool.token0 })
    const token1 = new Token({ chainId: chainId, ...vault.pool.token1 })

    return [token0, token1]
  }, [chainId, vault])

  const [token0Amount, token1Amount] = useMemo(() => {
    if (!position) return [null, null]

    const token0Amount = Amount.fromRawAmount(token0, position.token0Balance)
    const token1Amount = Amount.fromRawAmount(token1, position.token1Balance)

    return [token0Amount, token1Amount]
  }, [position, token0, token1])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (!data) return

      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'burn',
        chainId: chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} smart pool`,
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} smart pool`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [account, chainId, token0.symbol, token1.symbol]
  )

  const { config } = usePrepareSendTransaction({
    ...{},
    chainId: chainId,
    enabled: +value > 0 && chainId === chain?.id,
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setValue('0')
    },
  })

  return (
    <>
      <CardContent>
        <CardGroup>
          <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary border border-accent">
            <div className="flex justify-between gap-4">
              <div>
                <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">{value}%</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={value === '25' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setValue('25')}
                  testId="liquidity-25"
                >
                  25%
                </Button>
                <Button
                  variant={value === '50' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setValue('50')}
                  testId="liquidity-50"
                >
                  50%
                </Button>
                <Button
                  variant={value === '75' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setValue('75')}
                  testId="liquidity-75"
                >
                  75%
                </Button>
                <Button
                  variant={value === '100' ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setValue('100')}
                  testId="liquidity-max"
                >
                  Max
                </Button>
                <SettingsOverlay
                  options={{
                    slippageTolerance: {
                      storageKey: 'removeSteerLiquidity',
                      defaultValue: '0.5',
                      title: 'Remove Liquidity Slippage',
                    },
                  }}
                  modules={[SettingsModule.SlippageTolerance]}
                >
                  <IconButton size="sm" name="Settings" icon={CogIcon} variant="secondary" className="!rounded-xl" />
                </SettingsOverlay>
              </div>
            </div>
            <div className="px-1 pt-2 pb-3">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="range"
                min="1"
                max="100"
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
              />
            </div>
          </div>
        </CardGroup>
        <Card variant="outline" className="space-y-6 p-6">
          <CardGroup>
            <CardLabel>{"You'll"} receive</CardLabel>
            <CardCurrencyAmountItem amount={token0Amount?.multiply(value).divide(100)} />
            <CardCurrencyAmountItem amount={token1Amount?.multiply(value).divide(100)} />
          </CardGroup>
        </Card>
      </CardContent>
      <CardFooter>
        <Checker.Connect fullWidth variant="outline" size="xl">
          <Checker.Network fullWidth variant="outline" size="xl" chainId={chainId}>
            <Button
              size="xl"
              loading={isWritePending}
              disabled={+value === 0}
              fullWidth
              onClick={() => sendTransaction?.()}
              testId="remove-or-add-liquidity"
            >
              {+value === 0 ? 'Enter Amount' : 'Remove'}
            </Button>
          </Checker.Network>
        </Checker.Connect>
      </CardFooter>
    </>
  )
}
