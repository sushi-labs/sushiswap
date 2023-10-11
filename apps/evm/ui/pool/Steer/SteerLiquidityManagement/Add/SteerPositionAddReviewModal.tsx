'use client'

import { calculateSlippageAmount } from '@sushiswap/amm'
import { Chain, ChainId } from '@sushiswap/chain'
import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { Amount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { Percent } from '@sushiswap/math'
import { isSteerChainId, STEER_PERIPHERY_ADDRESS } from '@sushiswap/steer-sdk'
import { steerPeripheryAbi } from '@sushiswap/steer-sdk/abi'
import {
  createErrorToast,
  createToast,
  Currency,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import {
  SendTransactionResult,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSteerAccountPosition,
  useWaitForTransaction,
  waitForTransaction,
} from '@sushiswap/wagmi'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Address, encodeFunctionData, UserRejectedRequestError } from 'viem'

import { SteerStrategyConfig } from '../../constants'
import { useSteerPositionAddDerivedInfo } from './SteerPositionAddProvider'

interface SteerPositionAddReviewModalProps {
  vault: SteerVault
  onSuccess: () => void
  successLink?: string
  children: ReactNode
}

export const SteerPositionAddReviewModal: FC<SteerPositionAddReviewModalProps> =
  ({ vault, onSuccess, successLink, children }) => {
    const { chainId } = vault as { chainId: ChainId }
    const { currencies, parsedAmounts } = useSteerPositionAddDerivedInfo({
      vault,
    })

    const { chain } = useNetwork()
    const { address } = useAccount()
    const [slippageTolerance] = useSlippageTolerance('addSteerLiquidity')

    const { data: accountPosition } = useSteerAccountPosition({
      account: address,
      vaultId: vault.id,
    })
    const accountPositionAmountsArray = useMemo(() => {
      if (!currencies || !accountPosition) return null

      const token0Amount = Amount.fromRawAmount(
        currencies.CURRENCY_A,
        accountPosition.token0Balance,
      )
      const token1Amount = Amount.fromRawAmount(
        currencies.CURRENCY_B,
        accountPosition.token1Balance,
      )

      return [token0Amount, token1Amount]
    }, [accountPosition, currencies])
    const accountPositionValues = useTokenAmountDollarValues({
      chainId: chainId,
      amounts: accountPositionAmountsArray,
    })
    const accountPositionValue = useMemo(
      () => accountPositionValues.reduce((acc, cur) => acc + cur, 0),
      [accountPositionValues],
    )

    const parsedAmountsArray = useMemo(
      () =>
        parsedAmounts
          ? [parsedAmounts?.CURRENCY_A, parsedAmounts?.CURRENCY_B]
          : null,
      [parsedAmounts],
    )
    const newPositionValues = useTokenAmountDollarValues({
      chainId: chainId,
      amounts: parsedAmountsArray,
    })
    const newPositionValue = useMemo(
      () => newPositionValues.reduce((acc, cur) => acc + cur, 0),
      [newPositionValues],
    )

    // const hasExistingPosition = !!existingPosition

    const slippagePercent = useMemo(() => {
      return new Percent(
        Math.floor(
          +(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100,
        ),
        10_000,
      )
    }, [slippageTolerance])

    const onSettled = useCallback(
      (data: SendTransactionResult | undefined, error: Error | null) => {
        if (error instanceof UserRejectedRequestError) {
          createErrorToast(error?.message, true)
        }
        if (!data || !currencies) return

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'mint',
          chainId: chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Adding liquidity to the ${currencies.CURRENCY_A?.symbol}/${currencies.CURRENCY_B?.symbol} smart pool`,
            completed: `Successfully added liquidity to the ${currencies.CURRENCY_A?.symbol}/${currencies.CURRENCY_B?.symbol} smart pool`,
            failed: 'Something went wrong when adding liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      [currencies, address, chainId],
    )

    const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
      if (!address || !currencies || !parsedAmounts || !isSteerChainId(chainId))
        return {}

      return {
        to: STEER_PERIPHERY_ADDRESS[chainId],
        data: encodeFunctionData({
          abi: steerPeripheryAbi,
          functionName: 'deposit',
          args: [
            vault.address as Address,
            parsedAmounts.CURRENCY_A.quotient,
            parsedAmounts.CURRENCY_B.quotient,
            calculateSlippageAmount(
              parsedAmounts.CURRENCY_A,
              slippagePercent,
            )[0],
            calculateSlippageAmount(
              parsedAmounts.CURRENCY_B,
              slippagePercent,
            )[0],
            address,
          ],
        }),
      }
    }, [
      address,
      chainId,
      currencies,
      parsedAmounts,
      slippagePercent,
      vault.address,
    ])

    const { config, isError } = usePrepareSendTransaction({
      ...prepare,
      chainId: chainId,
      enabled: chainId === chain?.id,
    })

    const {
      sendTransactionAsync,
      isLoading: isWritePending,
      data,
    } = useSendTransaction({
      ...config,
      gas: config?.gas ? (config.gas * 120n) / 100n : undefined,
      chainId: chainId,
      onSettled,
      onSuccess,
    })

    const { status } = useWaitForTransaction({
      chainId: chainId,
      hash: data?.hash,
    })

    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              {children}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {SteerStrategyConfig[vault.strategy].name}
                  </DialogTitle>
                  <DialogDescription>Add liquidity</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue flex title="Network">
                        {Chain.from(chainId).name}
                      </List.KeyValue>
                    </List.Control>
                  </List>
                  <List className="!pt-0">
                    <List.Control>
                      {accountPosition?.steerTokenBalance !== 0n && (
                        <List.KeyValue flex title="Current Position Value">
                          {formatUSD(accountPositionValue)}
                        </List.KeyValue>
                      )}
                      <List.KeyValue flex title="New Position Value">
                        {formatUSD(newPositionValue)}
                      </List.KeyValue>
                    </List.Control>
                  </List>
                  <List className="!pt-0">
                    <List.Control>
                      {currencies && parsedAmounts && (
                        <>
                          <List.KeyValue
                            flex
                            title={`${currencies.CURRENCY_A.symbol}`}
                          >
                            <div className="flex items-center gap-2">
                              <Currency.Icon
                                currency={currencies.CURRENCY_A}
                                width={18}
                                height={18}
                              />
                              {parsedAmounts.CURRENCY_A?.toSignificant(6)}{' '}
                              {currencies.CURRENCY_A.symbol}
                            </div>
                          </List.KeyValue>

                          <List.KeyValue
                            flex
                            title={`${currencies.CURRENCY_B.symbol}`}
                          >
                            <div className="flex items-center gap-2">
                              <Currency.Icon
                                currency={currencies.CURRENCY_B}
                                width={18}
                                height={18}
                              />
                              {parsedAmounts.CURRENCY_B.toSignificant(6)}{' '}
                              {currencies.CURRENCY_B.symbol}
                            </div>
                          </List.KeyValue>
                        </>
                      )}
                    </List.Control>
                  </List>
                </div>
                <DialogFooter>
                  <Button
                    size="xl"
                    fullWidth
                    loading={!sendTransactionAsync || isWritePending}
                    onClick={() =>
                      sendTransactionAsync?.().then(() => confirm())
                    }
                    disabled={isError}
                    testId="confirm-add-liquidity"
                    type="button"
                  >
                    {isError ? (
                      'Shoot! Something went wrong :('
                    ) : isWritePending ? (
                      <Dots>Confirm Add</Dots>
                    ) : (
                      'Add Liquidity'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogConfirm
          chainId={chainId as ChainId}
          status={status}
          testId="add-concentrated-liquidity-confirmation-modal"
          successMessage={`You successfully added liquidity to the ${vault.token0.symbol}/${vault.token1.symbol} pair`}
          txHash={data?.hash}
          buttonLink={successLink}
          buttonText="View your position"
        />
      </DialogProvider>
    )
  }
