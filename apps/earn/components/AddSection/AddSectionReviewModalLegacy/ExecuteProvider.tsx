import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { calculateGasMargin, PairState, useSendTransaction, useSushiSwapRouterContract } from '@sushiswap/wagmi'
import { FC, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useTransactionDeadline } from '../../../lib/hooks'
import { useNotifications, useSettings } from '../../../lib/state/storage'
import { AddSectionReviewModalLegacyProps } from './AddSectionReviewModalLegacy'

interface ExecuteProvider extends Omit<AddSectionReviewModalLegacyProps, 'children'> {
  onSuccess(): void
  children({ execute, isWritePending }: { execute: (() => void) | undefined; isWritePending: boolean })
}

export const ExecuteProvider: FC<ExecuteProvider> = ({
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
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)
  const contract = useSushiSwapRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !token0 || !token1) return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, token0, token1]
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const prepare = useCallback(
    async (setRequest) => {
      try {
        if (
          !token0 ||
          !token1 ||
          !chainId ||
          !contract ||
          !input0 ||
          !input1 ||
          !address ||
          !minAmount0 ||
          !minAmount1 ||
          !deadline
        )
          return
        const withNative = token0.isNative || token1.isNative

        if (withNative) {
          const value = (token1.isNative ? input1 : input0).quotient.toString()
          const args = [
            (token1.isNative ? token0 : token1).wrapped.address,
            (token1.isNative ? input0 : input1).quotient.toString(),
            (token1.isNative ? minAmount0 : minAmount1).quotient.toString(),
            (token1.isNative ? minAmount1 : minAmount0).quotient.toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addLiquidityETH(...args, { value })
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidityETH', args),
            value,
            gasLimit: calculateGasMargin(gasLimit),
          })
        } else {
          const args = [
            token0.wrapped.address,
            token1.wrapped.address,
            input0.quotient.toString(),
            input1.quotient.toString(),
            minAmount0.quotient.toString(),
            minAmount1.quotient.toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
      } catch (e: unknown) {
        //
      }
    },
    [token0, token1, chainId, contract, input0, input1, address, minAmount0, minAmount1, deadline]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess,
  })

  return children({ execute: sendTransaction, isWritePending })
}
