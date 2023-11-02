'use client'

import { CogIcon } from '@heroicons/react-v1/solid'
import { SteerVault } from '@sushiswap/client'
import { useDebounce, useSlippageTolerance } from '@sushiswap/hooks'
import { isSteerChainId } from '@sushiswap/steer-sdk'
import { steerMultiPositionManager } from '@sushiswap/steer-sdk/abi'
import {
  Button,
  Card,
  CardCurrencyAmountItem,
  CardGroup,
  CardLabel,
  IconButton,
  SettingsModule,
  SettingsOverlay,
  classNames,
  createErrorToast,
  createToast,
} from '@sushiswap/ui'
import {
  Checker,
  SendTransactionResult,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSteerAccountPosition,
  waitForTransaction,
} from '@sushiswap/wagmi'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { slippageAmount } from 'sushi'
import { ChainId } from 'sushi/chain'
import { Amount, Token } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { Address, UserRejectedRequestError, encodeFunctionData } from 'viem'

interface SteerPositionRemoveProps {
  vault: SteerVault
}

export const SteerPositionRemove: FC<SteerPositionRemoveProps> = ({
  vault,
}) => {
  const { chainId } = vault as { chainId: ChainId }

  const { chain } = useNetwork()
  const { address: account } = useAccount()
  const [value, setValue] = useState<string>('0')
  const [slippageTolerance] = useSlippageTolerance('removeSteerLiquidity')
  const debouncedValue = useDebounce(value, 300)

  const slippagePercent = useMemo(() => {
    return new Percent(
      Math.floor(
        +(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100,
      ),
      10_000,
    )
  }, [slippageTolerance])

  const { data: position, isLoading: isPositionLoading } =
    useSteerAccountPosition({
      account: account,
      vaultId: vault.id,
    })

  const [token0, token1] = useMemo(() => {
    const token0 = new Token({ chainId: chainId, ...vault.pool.token0 })
    const token1 = new Token({ chainId: chainId, ...vault.pool.token1 })

    return [token0, token1]
  }, [chainId, vault])

  const tokenAmountsTotal = useMemo(() => {
    const token0Amount = Amount.fromRawAmount(
      token0,
      position?.token0Balance || 0n,
    )
    const token1Amount = Amount.fromRawAmount(
      token1,
      position?.token1Balance || 0n,
    )

    return [token0Amount, token1Amount]
  }, [position, token0, token1])

  const tokenAmountsDiscounted = useMemo(() => {
    const liquidityPercentage = new Percent(debouncedValue, 100)
    const token0Amount = Amount.fromRawAmount(
      token0,
      liquidityPercentage.multiply(tokenAmountsTotal[0].quotient).quotient,
    )
    const token1Amount = Amount.fromRawAmount(
      token1,
      liquidityPercentage.multiply(tokenAmountsTotal[1].quotient).quotient,
    )
    const steerTokenAmount = liquidityPercentage.multiply(
      position?.steerTokenBalance || 0n,
    ).quotient

    return { token0Amount, token1Amount, steerTokenAmount }
  }, [position, tokenAmountsTotal, debouncedValue, token0, token1])

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
    [account, chainId, token0.symbol, token1.symbol],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (
      !account ||
      position?.steerTokenBalance === 0n ||
      !tokenAmountsDiscounted ||
      !isSteerChainId(chainId)
    )
      return {}

    return {
      to: vault.address as Address,
      data: encodeFunctionData({
        abi: steerMultiPositionManager,
        functionName: 'withdraw',
        args: [
          tokenAmountsDiscounted.steerTokenAmount,
          slippageAmount(
            tokenAmountsDiscounted.token0Amount,
            slippagePercent,
          )[0],
          slippageAmount(
            tokenAmountsDiscounted.token1Amount,
            slippagePercent,
          )[0],
          account,
        ],
      }),
    }
  }, [
    account,
    chainId,
    position?.steerTokenBalance,
    slippagePercent,
    tokenAmountsDiscounted,
    vault.address,
  ])

  const { config } = usePrepareSendTransaction({
    ...prepare,
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
    <div
      className={classNames(
        isPositionLoading || position?.steerTokenBalance === 0n
          ? 'opacity-40 pointer-events-none'
          : '',
        'flex flex-col gap-4',
      )}
    >
      <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary border border-accent">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">
              {value}%
            </h1>
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
              <IconButton
                size="sm"
                name="Settings"
                icon={CogIcon}
                variant="secondary"
                className="!rounded-xl"
              />
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
      <Card variant="outline" className="space-y-6 p-6">
        <CardGroup>
          <CardLabel>{"You'll"} receive</CardLabel>
          <CardCurrencyAmountItem
            amount={tokenAmountsTotal?.[0].multiply(value).divide(100)}
          />
          <CardCurrencyAmountItem
            amount={tokenAmountsTotal?.[1].multiply(value).divide(100)}
          />
        </CardGroup>
      </Card>
      <Checker.Connect testId="connect" fullWidth variant="outline" size="xl">
        <Checker.Network
          testId="switch-network"
          fullWidth
          variant="outline"
          size="xl"
          chainId={chainId}
        >
          <Button
            size="xl"
            loading={isWritePending}
            disabled={+value === 0}
            fullWidth
            onClick={() => sendTransaction?.()}
            testId="remove-or-add-steer-liquidity"
          >
            {+value === 0 ? 'Enter Amount' : 'Remove'}
          </Button>
        </Checker.Network>
      </Checker.Connect>
    </div>
  )
}
