import { getAddress } from '@ethersproject/address'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { LimitOrder, STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import { calculateGasMargin, ZERO } from 'app/functions'
import { useBentoBoxContract, useLimitOrderHelperContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useAppDispatch } from 'app/state/hooks'
import { clear, setLimitOrderAttemptingTxn, setLimitOrderBentoPermit } from 'app/state/limit-order/actions'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

const getEndTime = (orderExpiration: OrderExpiration | string): number => {
  switch (orderExpiration) {
    case OrderExpiration.hour:
      return Math.floor(new Date().getTime() / 1000) + 3600
    case OrderExpiration.day:
      return Math.floor(new Date().getTime() / 1000) + 86400
    case OrderExpiration.week:
      return Math.floor(new Date().getTime() / 1000) + 604800
    case OrderExpiration.never:
    default:
      return Number.MAX_SAFE_INTEGER
  }
}

export type DepositAndApprovePayload = { inputAmount: CurrencyAmount<Currency>; bentoPermit: Signature }
export type DepositPayload = {
  inputAmount?: CurrencyAmount<Currency>
  bentoPermit?: Signature
  fromBentoBalance: boolean
}
export type ExecutePayload = {
  orderExpiration: OrderExpiration | string
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  recipient?: string
}

export type UseLimitOrderExecuteDeposit = (x: DepositPayload) => Promise<TransactionResponse | undefined>
export type UseLimitOrderExecuteExecute = (x: ExecutePayload) => void
export type UseLimitOrderExecute = () => {
  deposit: UseLimitOrderExecuteDeposit
  execute: UseLimitOrderExecuteExecute
}

const useLimitOrderExecute: UseLimitOrderExecute = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const bentoBoxContract = useBentoBoxContract()
  const limitOrderHelperContract = useLimitOrderHelperContract()
  const addTransaction = useTransactionAdder()
  const limitOrderContractAddress = chainId && STOP_LIMIT_ORDER_ADDRESS[chainId]
  const addPopup = useAddPopup()
  const { mutate } = useLimitOrders()

  // Deposit to BentoBox and approve BentoBox in one transaction
  const depositAndApprove = useCallback(
    async ({ inputAmount, bentoPermit }: DepositAndApprovePayload) => {
      const { v, r, s } = bentoPermit
      const amount = inputAmount.quotient.toString()

      try {
        const estimatedGas = await limitOrderHelperContract?.estimateGas.depositAndApprove(
          account,
          limitOrderContractAddress,
          true,
          v,
          r,
          s,
          {
            value: amount,
          }
        )

        if (estimatedGas) {
          dispatch(setLimitOrderAttemptingTxn(true))
          const tx = await limitOrderHelperContract?.depositAndApprove(
            account,
            limitOrderContractAddress,
            true,
            v,
            r,
            s,
            {
              value: amount,
              gasLimit: calculateGasMargin(estimatedGas),
            }
          )

          await tx.wait()
          addTransaction(tx, {
            summary: `Approve limit orders and Deposit ${inputAmount.currency.symbol} into BentoBox`,
          })
          dispatch(setLimitOrderAttemptingTxn(false))
          dispatch(setLimitOrderBentoPermit(undefined))

          return tx
        }
      } catch (error) {
        dispatch(setLimitOrderAttemptingTxn(false))
        console.error(error)
      }
    },
    [account, addTransaction, dispatch, limitOrderContractAddress, limitOrderHelperContract]
  )

  // Deposit to BentoBox
  const deposit = useCallback<UseLimitOrderExecuteDeposit>(
    async ({ inputAmount, bentoPermit, fromBentoBalance }) => {
      if (!bentoBoxContract || !limitOrderContractAddress || !inputAmount) throw new Error('Dependencies unavailable')

      const batch: string[] = []
      const amount = inputAmount.quotient.toString()

      // Since the setMasterContractApproval is not payable, we can't batch native deposit and approve
      // For this case, we setup a helper contract
      if (inputAmount.currency.isNative && bentoPermit) {
        return depositAndApprove({ inputAmount, bentoPermit })
      }

      try {
        // If we have the permit, add the permit to the batch
        if (bentoPermit) {
          const { v, r, s } = bentoPermit
          batch.push(
            bentoBoxContract.interface.encodeFunctionData('setMasterContractApproval', [
              account,
              limitOrderContractAddress,
              true,
              v,
              r,
              s,
            ])
          )
        }

        // If we spend from wallet, we have to deposit into bentoBox first
        if (!fromBentoBalance) {
          if (inputAmount.currency.isNative) {
            batch.push(
              bentoBoxContract.interface.encodeFunctionData('deposit', [AddressZero, account, account, amount, 0])
            )
          } else {
            batch.push(
              bentoBoxContract.interface.encodeFunctionData('deposit', [
                getAddress(inputAmount.currency.wrapped.address),
                account,
                account,
                amount,
                0,
              ])
            )
          }
        }

        dispatch(setLimitOrderAttemptingTxn(true))
        const tx = await bentoBoxContract.batch(batch, true, {
          value: inputAmount.currency.isNative ? amount : ZERO,
        })

        await tx.wait()
        addTransaction(tx, { summary: 'Create limit order' })

        dispatch(setLimitOrderAttemptingTxn(false))
        dispatch(setLimitOrderBentoPermit(undefined))
        return tx
      } catch (e) {
        dispatch(setLimitOrderAttemptingTxn(false))
      }
    },
    [account, addTransaction, bentoBoxContract, depositAndApprove, dispatch, limitOrderContractAddress]
  )

  const execute = useCallback<UseLimitOrderExecuteExecute>(
    async ({ orderExpiration, inputAmount, outputAmount, recipient }) => {
      if (!inputAmount || !outputAmount || !account || !library) throw new Error('Dependencies unavailable')

      const endTime = getEndTime(orderExpiration)
      const order = new LimitOrder(
        account,
        inputAmount.wrapped,
        outputAmount.wrapped,
        recipient ? recipient : account,
        Math.floor(new Date().getTime() / 1000).toString(),
        endTime.toString()
      )

      try {
        dispatch(setLimitOrderAttemptingTxn(true))
        await order?.signOrderWithProvider(chainId || 1, library)

        const resp = await order?.send()
        if (resp.success) {
          addPopup({
            txn: { hash: '', summary: 'Limit order created', success: true },
          })

          await mutate()
          dispatch(clear())
        }

        dispatch(setLimitOrderAttemptingTxn(false))
      } catch (e) {
        dispatch(setLimitOrderAttemptingTxn(false))
        addPopup({
          txn: {
            hash: '',
            // @ts-ignore TYPE NEEDS FIXING
            summary: `Error: ${e?.response?.data?.data}`,
            success: false,
          },
        })
      }
    },
    [account, addPopup, chainId, dispatch, library, mutate]
  )

  return {
    deposit,
    execute,
  }
}

export default useLimitOrderExecute
