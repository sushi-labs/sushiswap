import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount, Type } from '@sushiswap/currency'
import { calculateGasMargin } from '@sushiswap/gas'
import { Percent } from '@sushiswap/math'
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
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { useTransactionDeadline } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { encodeFunctionData, UserRejectedRequestError } from 'viem'

import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalLegacyProps {
  poolState: SushiSwapV2PoolState
  chainId: SushiSwapV2ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  open: boolean
  close(): void
}

export const AddSectionReviewModalLegacy: FC<AddSectionReviewModalLegacyProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  open,
  close,
}) => {
  const deadline = useTransactionDeadline(chainId)
  const { address } = useAccount()
  const { chain } = useNetwork()

  const contract = useSushiSwapRouterContract(chainId)
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

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
    [chainId, token0, token1, address]
  )

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === SushiSwapV2PoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === SushiSwapV2PoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

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
          const value = BigInt((token1.isNative ? input1 : input0).quotient.toString())
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
            data: encodeFunctionData({ ...contract, functionName: 'addLiquidityETH', args }),
            value,
            gas: calculateGasMargin(gasLimit),
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
            data: encodeFunctionData({ ...contract, functionName: 'addLiquidity', args }),
            gas: calculateGasMargin(gasLimit),
          }
        }
      } catch (e: unknown) {
        //
      }
    }

    prep().then((data) => setPrepare(data))
  }, [token0, token1, chain?.id, contract, input0, input1, address, minAmount0, minAmount1, deadline])

  const { config } = usePrepareSendTransaction({ ...prepare, chainId })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: close,
  })

  return (
    <>
      <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} close={close}>
        <Button size="xl" disabled={isWritePending || !sendTransaction} fullWidth onClick={() => sendTransaction?.()}>
          {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
        </Button>
      </AddSectionReviewModal>
    </>
  )
}
