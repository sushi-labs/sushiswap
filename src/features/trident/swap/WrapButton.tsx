import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import { useDerivedTridentSwapContext } from 'app/features/trident/swap/DerivedTradeContext'
import { selectTridentSwap } from 'app/features/trident/swap/swapSlice'
import { useBentoBox, useBentoBoxContract, useWETH9Contract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import React, { FC } from 'react'

import TridentApproveGate from '../TridentApproveGate'

const WrapButton: FC = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const wethContract = useWETH9Contract()
  const bentoBox = useBentoBoxContract()
  const { deposit, withdraw } = useBentoBox()
  const addTransaction = useTransactionAdder()
  const { spendFromWallet, receiveToWallet, attemptingTxn } = useAppSelector(selectTridentSwap)
  const { parsedAmounts, error } = useDerivedTridentSwapContext()

  const execute = async () => {
    if (!wethContract || !parsedAmounts?.[0] || !chainId) return

    if (spendFromWallet && receiveToWallet) {
      let txReceipt
      if (parsedAmounts?.[0]?.currency.isNative) {
        txReceipt = await wethContract.deposit({ value: parsedAmounts?.[0].quotient.toString() })
      } else {
        txReceipt = await wethContract.withdraw(parsedAmounts?.[0].quotient.toString())
      }

      return addTransaction(txReceipt, {
        summary: parsedAmounts?.[0]?.currency.isNative
          ? i18n._(
              // @ts-ignore TYPE NEEDS FIXING
              t`Wrap ${parsedAmounts?.[0].toSignificant(6)} ${NATIVE[chainId].symbol} to ${WNATIVE[chainId].symbol}`
            )
          : i18n._(
              // @ts-ignore TYPE NEEDS FIXING
              t`Unwrap ${parsedAmounts?.[0].toSignificant(6)} ${WNATIVE[chainId].symbol} to ${NATIVE[chainId].symbol}`
            ),
      })
    }

    if (!spendFromWallet && receiveToWallet) {
      return await withdraw(WNATIVE_ADDRESS[chainId], parsedAmounts?.[0]?.quotient.toString().toBigNumber(0))
    }

    if (spendFromWallet && !receiveToWallet) {
      return await deposit(WNATIVE_ADDRESS[chainId], parsedAmounts?.[0]?.quotient.toString().toBigNumber(0))
    }
  }

  return (
    <TridentApproveGate inputAmounts={[parsedAmounts?.[0]]} tokenApproveOn={bentoBox?.address}>
      {({ approved, loading }) => {
        let disabled = !!error || !approved || loading || attemptingTxn
        let buttonTextParts = [parsedAmounts?.[0]?.currency.isNative ? i18n._(t`Wrap`) : i18n._(t`Unwrap`)]

        if (!spendFromWallet && receiveToWallet) buttonTextParts = [i18n._(t`Withdraw`), ...buttonTextParts]
        if (spendFromWallet && !receiveToWallet) buttonTextParts = [i18n._(t`Deposit`)]
        if (!spendFromWallet && !receiveToWallet) {
          disabled = true
          buttonTextParts = [i18n._(t`Unsupported`)]
        }

        const buttonText = attemptingTxn ? (
          <Dots>{buttonTextParts.join(' + ')}</Dots>
        ) : loading ? (
          ''
        ) : error ? (
          error
        ) : (
          buttonTextParts.join(' + ')
        )

        return (
          <div className="flex">
            <Button fullWidth id="wrap-button" loading={loading} color="gradient" disabled={disabled} onClick={execute}>
              {buttonText}
            </Button>
          </div>
        )
      }}
    </TridentApproveGate>
  )
}

export default WrapButton
