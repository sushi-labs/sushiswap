import { Signature } from '@ethersproject/bytes'
import { TransactionRequest } from '@ethersproject/providers'
import { calculateSlippageAmount } from '@sushiswap/amm'
import { Amount, Type } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { Dots } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { useSendTransaction } from '@sushiswap/wagmi'
import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { PoolState } from '../../lib/hooks/useConcentratedLiquidityPools'
import { Pool } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'

interface AddSectionReviewModalConcentratedProps {
  poolState: PoolState
  pool: Pool | null | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalConcentrated: FC<AddSectionReviewModalConcentratedProps> = ({
  poolState,
  pool,
  input0,
  input1,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { token0, token1, chainId } = useConcentratedLiquidityURLState()
  const { address } = useAccount()

  const [slippageTolerance] = useSlippageTolerance()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chainId || !token0 || !token1) return
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
    [chainId, address, token0, token1]
  )

  // async function onAdd() {
  //   if (!chainId || !provider || !address) return
  //
  //   if (!positionManager || !baseCurrency || !quoteCurrency) {
  //     return
  //   }
  //
  //   if (position && deadline) {
  //     const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
  //     const { calldata, value } =
  //       hasExistingPosition && tokenId
  //         ? NonfungiblePositionManager.addCallParameters(position, {
  //             tokenId,
  //             slippageTolerance: slippagePercent,
  //             deadline: deadline.toString(),
  //             useNative,
  //           })
  //         : NonfungiblePositionManager.addCallParameters(position, {
  //             slippageTolerance: slippagePercent,
  //             recipient: address,
  //             deadline: deadline.toString(),
  //             useNative,
  //             createPool: noLiquidity,
  //           })
  //
  //     let txn: { to: string; data: string; value: string } = {
  //       to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
  //       data: calldata,
  //       value,
  //     }
  //
  //     if (argentWalletContract) {
  //       const amountA = parsedAmounts[Field.CURRENCY_A]
  //       const amountB = parsedAmounts[Field.CURRENCY_B]
  //       const batch = [
  //         ...(amountA && amountA.currency.isToken
  //           ? [approveAmountCalldata(amountA, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
  //           : []),
  //         ...(amountB && amountB.currency.isToken
  //           ? [approveAmountCalldata(amountB, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId])]
  //           : []),
  //         {
  //           to: txn.to,
  //           data: txn.data,
  //           value: txn.value,
  //         },
  //       ]
  //       const data = argentWalletContract.interface.encodeFunctionData('wc_multiCall', [batch])
  //       txn = {
  //         to: argentWalletContract.address,
  //         data,
  //         value: '0x0',
  //       }
  //     }
  //
  //     setAttemptingTxn(true)
  //
  //     provider
  //       .getSigner()
  //       .estimateGas(txn)
  //       .then((estimate) => {
  //         const newTxn = {
  //           ...txn,
  //           gasLimit: calculateGasMargin(estimate),
  //         }
  //
  //         return provider
  //           .getSigner()
  //           .sendTransaction(newTxn)
  //           .then((response: TransactionResponse) => {
  //             setAttemptingTxn(false)
  //             addTransaction(response, {
  //               type: TransactionType.ADD_LIQUIDITY_V3_POOL,
  //               baseCurrencyId: currencyId(baseCurrency),
  //               quoteCurrencyId: currencyId(quoteCurrency),
  //               createPool: Boolean(noLiquidity),
  //               expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
  //               expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
  //               feeAmount: position.pool.fee,
  //             })
  //             setTxHash(response.hash)
  //             sendEvent({
  //               category: 'Liquidity',
  //               action: 'Add',
  //               label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/'),
  //             })
  //           })
  //       })
  //       .catch((error) => {
  //         console.error('Failed to send transaction', error)
  //         setAttemptingTxn(false)
  //         // we only care if the error is something _other_ than the user rejected the tx
  //         if (error?.code !== 4001) {
  //           console.error(error)
  //         }
  //       })
  //   } else {
  //     return
  //   }
  // }

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {},
    []
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: close,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <AddSectionReviewModal
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={() => setOpen(false)}
      >
        <Button size="xl" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()}>
          {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
        </Button>
      </AddSectionReviewModal>
    </>
  )
}
