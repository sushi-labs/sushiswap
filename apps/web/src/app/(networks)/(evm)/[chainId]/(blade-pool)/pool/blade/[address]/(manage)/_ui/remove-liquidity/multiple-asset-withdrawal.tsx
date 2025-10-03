'use client'

import { Button, Dots } from '@sushiswap/ui'
import { type FC, useCallback } from 'react'
import type { useBladeWithdrawTransaction } from 'src/lib/pool/blade/useBladeWithdraw'
import type { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useAccount } from 'wagmi'

interface MultipleAssetWithdrawalProps {
  amountToRemove: Amount<EvmCurrency> | undefined
  onConfirm: () => void
  withdrawTransaction: ReturnType<typeof useBladeWithdrawTransaction>
}

export const MultipleAssetWithdrawal: FC<MultipleAssetWithdrawalProps> = ({
  amountToRemove,
  onConfirm,
  withdrawTransaction,
}) => {
  const { address } = useAccount()

  const handleConfirmTransaction = useCallback(async () => {
    if (!amountToRemove || !address) return

    try {
      await withdrawTransaction.mutateAsync({
        poolTokenAmountToBurn: amountToRemove.amount.toString(),
      })
      onConfirm()
    } catch {}
  }, [amountToRemove, address, withdrawTransaction, onConfirm])

  return (
    <Button
      size="xl"
      fullWidth
      onClick={handleConfirmTransaction}
      disabled={withdrawTransaction.isPending}
      className="mt-4"
    >
      {withdrawTransaction.isPending ? (
        <Dots>Confirm Withdraw</Dots>
      ) : (
        'Confirm Withdraw'
      )}
    </Button>
  )
}
