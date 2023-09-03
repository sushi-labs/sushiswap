'use client'

import { calculateSlippageAmount } from '@sushiswap/amm'
import { Chain, ChainId } from '@sushiswap/chain'
import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { Percent } from '@sushiswap/math'
import { isSteerChainId, STEER_PERIPHERY_ADDRESS } from '@sushiswap/steer-sdk'
import { steerPeripheryAbi } from '@sushiswap/steer-sdk/abi'
import {
  createErrorToast,
  createToast,
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
import { SendTransactionResult, useSendTransaction, waitForTransaction } from '@sushiswap/wagmi'
import { useAccount, useNetwork, usePrepareSendTransaction, useWaitForTransaction } from '@sushiswap/wagmi'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Address, encodeFunctionData, UserRejectedRequestError } from 'viem'

import { useSteerPositionAddDerivedInfo } from './SteerPositionAddProvider'

interface SteerPositionAddReviewModalProps {
  vault: SteerVault
  onSuccess: () => void
  successLink?: string
  children: ReactNode
}

export const SteerPositionAddReviewModal: FC<SteerPositionAddReviewModalProps> = ({
  vault,
  onSuccess,
  successLink,
  children,
}) => {
  const { chainId } = vault as { chainId: ChainId }
  const { currencies, parsedAmounts } = useSteerPositionAddDerivedInfo({ vault })

  const { chain } = useNetwork()
  const { address } = useAccount()
  const [slippageTolerance] = useSlippageTolerance('addSteerLiquidity')

  // const fiatAmounts = useMemo(
  //   () => [tryParseAmount('1', currencies?.CURRENCY_A?.wrapped), tryParseAmount('1', currencies?.CURRENCY_B?.wrapped)],
  //   [currencies]
  // )
  // const fiatAmountsAsNumber = useTokenAmountDollarValues({ chainId: chainId, amounts: fiatAmounts })

  // const hasExistingPosition = !!existingPosition

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
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
    [currencies, address, chainId]
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (!address || !currencies || !parsedAmounts || !isSteerChainId(chainId)) return {}

    return {
      to: STEER_PERIPHERY_ADDRESS[chainId],
      data: encodeFunctionData({
        abi: steerPeripheryAbi,
        functionName: 'deposit',
        args: [
          vault.address as Address,
          parsedAmounts.CURRENCY_A.quotient,
          parsedAmounts.CURRENCY_B.quotient,
          calculateSlippageAmount(parsedAmounts.CURRENCY_A, slippagePercent)[0],
          calculateSlippageAmount(parsedAmounts.CURRENCY_B, slippagePercent)[0],
          address,
        ],
      }),
    }
  }, [address, chainId, currencies, parsedAmounts, slippagePercent, vault.address])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId: chainId,
    enabled: chainId === chain?.id,
  })

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
    isError,
  } = useSendTransaction({
    ...config,
    chainId: chainId,
    onSettled,
    onSuccess,
  })

  const { status } = useWaitForTransaction({ chainId: chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {vault.token0.symbol}/{vault.token1.symbol}
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
              </div>
              <DialogFooter>
                <Button
                  size="xl"
                  fullWidth
                  loading={!sendTransactionAsync || isWritePending}
                  onClick={() => sendTransactionAsync?.().then(() => confirm())}
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
