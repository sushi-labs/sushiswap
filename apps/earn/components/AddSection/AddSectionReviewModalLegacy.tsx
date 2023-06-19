import { TransactionRequest } from '@ethersproject/providers'
import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount, Type } from '@sushiswap/currency'
import { calculateGasMargin } from '@sushiswap/gas'
import { Percent } from '@sushiswap/math'
import { Dots } from '@sushiswap/ui'
import {
  _useSendTransaction as useSendTransaction,
  Address,
  PairState,
  useAccount,
  useNetwork,
  useSushiSwapRouterContract,
} from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'

import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { useTransactionDeadline } from '../../lib/hooks'
import { AddSectionReviewModal } from './AddSectionReviewModal'

import { SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { Button } from '@sushiswap/ui/future/components/button'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { useApproved } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_ADD_LEGACY } from '../../lib/constants'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'

interface AddSectionReviewModalLegacyProps {
  poolState: PairState
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
  const contract = useSushiSwapRouterContract(chainId)
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { approved } = useApproved(APPROVE_TAG_ADD_LEGACY)
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !token0 || !token1) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
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
    [chainId, token0, token1, address]
  )

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
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
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
          return
        const withNative = token0.isNative || token1.isNative

        if (withNative) {
          const value = BigNumber.from((token1.isNative ? input1 : input0).quotient.toString())
          const args = [
            (token1.isNative ? token0 : token1).wrapped.address as Address,
            BigNumber.from((token1.isNative ? input0 : input1).quotient.toString()),
            BigNumber.from((token1.isNative ? minAmount0 : minAmount1).quotient.toString()),
            BigNumber.from((token1.isNative ? minAmount1 : minAmount0).quotient.toString()),
            address,
            BigNumber.from(deadline.toHexString()),
          ] as const

          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidityETH', args),
            value,
          })
        } else {
          const args = [
            token0.wrapped.address as Address,
            token1.wrapped.address as Address,
            BigNumber.from(input0.quotient.toString()),
            BigNumber.from(input1.quotient.toString()),
            BigNumber.from(minAmount0.quotient.toString()),
            BigNumber.from(minAmount1.quotient.toString()),
            address,
            BigNumber.from(deadline.toHexString()),
          ] as const
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidity', args),
          })
        }
      } catch (e: unknown) {
        console.error(e)
      }
    },
    [token0, token1, chain?.id, contract, input0, input1, address, minAmount0, minAmount1, deadline]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: close,
    enabled: approved,
    gasMargin: true,
  })
  return (
    <AddSectionReviewModal
      chainId={chainId as BentoBoxV1ChainId}
      input0={input0}
      input1={input1}
      open={open}
      close={close}
    >
      <Button
        size="xl"
        disabled={isWritePending}
        loading={Boolean(!sendTransaction)}
        fullWidth
        onClick={() => sendTransaction?.()}
        testId="confirm-add-v2-liquidity"
      >
        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
      </Button>
    </AddSectionReviewModal>
  )
}
