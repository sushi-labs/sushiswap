import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast } from '@sushiswap/notifications'
import { Button, Currency, Dots } from '@sushiswap/ui'
import { type FC, useCallback, useMemo } from 'react'
import {
  useBladeWithdrawRequest,
  type useBladeWithdrawTransaction,
} from 'src/lib/pool/blade/useBladeWithdraw'
import { Amount, formatUSD } from 'sushi'
import { type EvmCurrency, EvmNative } from 'sushi/evm'
import { useAccount } from 'wagmi'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface SingleAssetWithdrawalProps {
  pool: BladePool
  selectedToken: EvmCurrency
  amountToRemove: Amount<EvmCurrency> | undefined
  prices: PriceMap | undefined
  onConfirm: () => void
  withdrawTransaction: ReturnType<typeof useBladeWithdrawTransaction>
}

export const SingleAssetWithdrawal: FC<SingleAssetWithdrawalProps> = ({
  pool,
  selectedToken,
  amountToRemove,
  prices,
  onConfirm,
  withdrawTransaction,
}) => {
  const { address } = useAccount()

  const onError = useCallback((e: Error) => {
    createErrorToast(e?.message, true)
  }, [])

  const withdrawRequest = useBladeWithdrawRequest({ onError })

  const { singleAssetData, hasTokenMismatch } = useMemo(() => {
    if (!withdrawRequest.data || !withdrawRequest.isSuccess) {
      return { singleAssetData: null, hasTokenMismatch: false }
    }

    const tokenMismatch =
      selectedToken.wrap().address.toLowerCase() !==
      withdrawRequest.data.asset_address.toLowerCase()

    if (tokenMismatch) {
      return { singleAssetData: null, hasTokenMismatch: true }
    }

    const exactAmount = Amount.fromHuman(
      selectedToken,
      BigInt(withdrawRequest.data.asset_amount),
    )

    const tokenPrice = prices?.get(selectedToken.wrap().address) || 0
    const usdValue = Number(exactAmount.amount) * tokenPrice

    return {
      singleAssetData: {
        exactAmount,
        usdValue,
      },
      hasTokenMismatch: false,
    }
  }, [selectedToken, withdrawRequest.data, withdrawRequest.isSuccess, prices])

  const handleGetQuote = useCallback(async () => {
    if (!amountToRemove || !address) return

    withdrawRequest.reset()

    const native = EvmNative.fromChainId(pool.chainId)
    const assetSymbol =
      selectedToken.wrap().id === native.wrap().id
        ? native.symbol
        : selectedToken.symbol || ''

    const payload = {
      chain_id: pool.chainId,
      pool_token_amount_to_burn: amountToRemove.amount.toString(),
      asset_symbol: assetSymbol,
      token_holder_address: address,
      pool_address: pool.address,
    }

    await withdrawRequest.mutateAsync(payload)
  }, [amountToRemove, address, pool, selectedToken, withdrawRequest])

  const handleConfirmTransaction = useCallback(async () => {
    if (!amountToRemove || !address || !withdrawRequest.data) return

    try {
      await withdrawTransaction.mutateAsync({
        poolTokenAmountToBurn: amountToRemove.amount.toString(),
        withdraw: withdrawRequest.data,
        token: selectedToken,
      })
      onConfirm()
    } catch {}
  }, [
    amountToRemove,
    address,
    withdrawRequest.data,
    withdrawTransaction,
    selectedToken,
    onConfirm,
  ])

  if (hasTokenMismatch) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.232 19c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-medium">Token mismatch</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
            The quote returned a different token than selected. Please try
            getting a new quote or select a different token.
          </p>
          <Button
            size="sm"
            onClick={handleGetQuote}
            disabled={withdrawRequest.isPending}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {withdrawRequest.isPending ? (
              <Dots>Getting quote</Dots>
            ) : (
              'Get New Quote'
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (!singleAssetData) {
    return (
      <Button
        size="xl"
        fullWidth
        onClick={handleGetQuote}
        disabled={withdrawRequest.isPending}
        className="mt-4"
      >
        {withdrawRequest.isPending ? <Dots>Getting quote</Dots> : 'Confirm'}
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg p-4 bg-white dark:bg-gray-800 border border-white dark:border-gray-700">
        <div className="text-sm text-gray-600 mb-3">You will receive:</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Currency.Icon currency={selectedToken} width={24} height={24} />
            <div>
              <div className="font-semibold text-sm text-gray-900">
                {selectedToken.symbol}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedToken.name}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-sm text-gray-900">
              {singleAssetData.exactAmount.toSignificant(6)}{' '}
              {selectedToken.symbol}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatUSD(singleAssetData.usdValue)}
            </div>
          </div>
        </div>
      </div>
      <Button
        size="xl"
        fullWidth
        onClick={handleConfirmTransaction}
        disabled={withdrawTransaction.isPending}
      >
        {withdrawTransaction.isPending ? (
          <Dots>Confirm Withdraw</Dots>
        ) : (
          'Confirm Withdraw'
        )}
      </Button>
    </div>
  )
}
