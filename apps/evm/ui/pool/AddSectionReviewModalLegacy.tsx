import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import {
  Address,
  SushiSwapV2PoolState,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSushiSwapRouterContract,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import {
  SendTransactionResult,
  waitForTransaction,
} from '@sushiswap/wagmi/actions'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { useApproved } from '@sushiswap/wagmi/systems/Checker/Provider'
import { APPROVE_TAG_ADD_LEGACY } from 'lib/constants'
import { useTransactionDeadline } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { gasMargin, slippageAmount } from 'sushi/calculate'
import { BentoBoxChainId } from 'sushi/config'
import { Amount, Type } from 'sushi/currency'
import { Percent, ZERO } from 'sushi/math'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'

import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalLegacyProps {
  poolState: SushiSwapV2PoolState
  poolAddress: string | undefined
  chainId: SushiSwapV2ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children: ReactNode
  onSuccess: () => void
}

export const AddSectionReviewModalLegacy: FC<AddSectionReviewModalLegacyProps> =
  ({
    poolAddress,
    poolState,
    chainId,
    token0,
    token1,
    input0,
    input1,
    children,
    onSuccess,
  }) => {
    const deadline = useTransactionDeadline(chainId)
    const contract = useSushiSwapRouterContract(chainId)
    const { address } = useAccount()
    const { chain } = useNetwork()
    const { approved } = useApproved(APPROVE_TAG_ADD_LEGACY)
    const [slippageTolerance] = useSlippageTolerance('addLiquidity')

    const onSettled = useCallback(
      (data: SendTransactionResult | undefined, error: Error | null) => {
        if (error instanceof UserRejectedRequestError) {
          createErrorToast(error?.message, true)
        }
        if (!data || !token0 || !token1) return

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'mint',
          chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
            completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
            failed: 'Something went wrong when adding liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      [chainId, token0, token1, address],
    )

    const [minAmount0, minAmount1] = useMemo(() => {
      return [
        input0
          ? poolState === SushiSwapV2PoolState.NOT_EXISTS
            ? input0
            : Amount.fromRawAmount(
                input0.currency,
                slippageAmount(input0, slippageTolerance)[0],
              )
          : undefined,
        input1
          ? poolState === SushiSwapV2PoolState.NOT_EXISTS
            ? input1
            : Amount.fromRawAmount(
                input1.currency,
                slippageAmount(input1, slippageTolerance)[0],
              )
          : undefined,
      ]
    }, [poolState, input0, input1, slippageTolerance])

    const [prepare, setPrepare] = useState<UsePrepareSendTransactionConfig>({})

    useEffect(() => {
      async function prep(): Promise<UsePrepareSendTransactionConfig> {
        try {
          if (
            !token0 ||
            !token1 ||
            !chain?.id ||
            !contract ||
            !input0 ||
            !input1 ||
            !address ||
            !minAmount0 ||
            !minAmount1 ||
            !deadline
          )
            return {}
          const withNative = token0.isNative || token1.isNative

          if (withNative) {
            const value = BigInt(
              (token1.isNative ? input1 : input0).quotient.toString(),
            )
            const args = [
              (token1.isNative ? token0 : token1).wrapped.address as Address,
              (token1.isNative ? input0 : input1).quotient,
              (token1.isNative ? minAmount0 : minAmount1).quotient,
              (token1.isNative ? minAmount1 : minAmount0).quotient,
              address,
              deadline,
            ] as const

            const gasLimit = await contract.estimateGas.addLiquidityETH(args, {
              account: address,
              value,
            })

            return {
              account: address,
              to: contract.address,
              data: encodeFunctionData({
                ...contract,
                functionName: 'addLiquidityETH',
                args,
              }),
              value,
              gas: gasMargin(gasLimit),
            }
          } else {
            const args = [
              token0.wrapped.address as Address,
              token1.wrapped.address as Address,
              input0.quotient,
              input1.quotient,
              minAmount0.quotient,
              minAmount1.quotient,
              address,
              deadline,
            ] as const

            const gasLimit = await contract.estimateGas.addLiquidity(args, {
              account: address,
            })
            return {
              account: address,
              to: contract.address,
              data: encodeFunctionData({
                ...contract,
                functionName: 'addLiquidity',
                args,
              }),
              gas: gasMargin(gasLimit),
            }
          }
        } catch (e: unknown) {
          //
        }
      }

      prep().then((data) => setPrepare(data))
    }, [
      token0,
      token1,
      chain?.id,
      contract,
      input0,
      input1,
      address,
      minAmount0,
      minAmount1,
      deadline,
    ])

    const { config } = usePrepareSendTransaction({
      ...prepare,
      chainId,
      enabled: Boolean(
        approved &&
          minAmount0?.greaterThan(ZERO) &&
          minAmount1?.greaterThan(ZERO),
      ),
    })

    const {
      sendTransactionAsync,
      isLoading: isWritePending,
      data,
    } = useSendTransaction({
      ...config,
      onSettled,
      onSuccess,
    })

    const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              <DialogTrigger asChild>{children}</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add liquidity</DialogTitle>
                  <DialogDescription>
                    Please review your entered details.
                  </DialogDescription>
                </DialogHeader>
                <AddSectionReviewModal
                  chainId={chainId as BentoBoxChainId}
                  input0={input0}
                  input1={input1}
                />
                <DialogFooter>
                  <Button
                    size="xl"
                    disabled={
                      isWritePending || !approved || !sendTransactionAsync
                    }
                    loading={Boolean(!sendTransactionAsync)}
                    fullWidth
                    onClick={() =>
                      sendTransactionAsync?.().then(() => confirm())
                    }
                    testId="confirm-add-v2-liquidity"
                  >
                    {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogConfirm
          chainId={chainId}
          status={status}
          testId="incentivize-confirmation-modal"
          successMessage="Successfully added liquidity"
          buttonText="Go to pool"
          buttonLink={`/pools/${chainId}:${poolAddress}`}
          txHash={data?.hash}
        />
      </DialogProvider>
    )
  }
