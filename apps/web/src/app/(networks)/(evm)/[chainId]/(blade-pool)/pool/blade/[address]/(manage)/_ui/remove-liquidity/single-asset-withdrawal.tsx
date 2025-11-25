'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast } from '@sushiswap/notifications'
import { Button, Currency, Dots, List, Message } from '@sushiswap/ui'
import { type FC, useCallback, useMemo } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'
import { logger } from 'src/lib/logger'
import type { useBladeWithdrawTransaction } from 'src/lib/pool/blade/useBladeWithdraw'
import { useBladeWithdrawRequest } from 'src/lib/pool/blade/useBladeWithdrawRequest'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker'

import { getOnchainPriceFromPool } from 'src/lib/pool/blade/utils'
import { Amount, Percent, formatUSD } from 'sushi'
import { type EvmCurrency, EvmNative } from 'sushi/evm'
import { useConnection } from 'wagmi'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'

interface SingleAssetWithdrawalProps {
  pool: BladePool
  selectedToken: EvmCurrency
  amountToRemove: Amount<EvmCurrency> | undefined
  prices: PriceMap | undefined
  onConfirm: () => void
  withdrawTransaction: ReturnType<typeof useBladeWithdrawTransaction>
  estimatedValue: number
}

export const SingleAssetWithdrawal: FC<SingleAssetWithdrawalProps> = ({
  pool,
  selectedToken,
  amountToRemove,
  prices,
  onConfirm,
  withdrawTransaction,
  estimatedValue,
}) => {
  const { address } = useConnection()

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) return
    logger.error(e, {
      location: 'SingleAssetWithdrawal',
    })
    createErrorToast(e?.message, true)
  }, [])

  const withdrawRequest = useBladeWithdrawRequest({ onError })

  const { singleAssetData, hasTokenMismatch } = useMemo(() => {
    if (!withdrawRequest.data || !withdrawRequest.isSuccess) {
      return { singleAssetData: null, hasTokenMismatch: false }
    }

    const tokenMismatch =
      selectedToken.wrap().address !==
      withdrawRequest.data.asset_address.toLowerCase()

    if (tokenMismatch) {
      return { singleAssetData: null, hasTokenMismatch: true }
    }

    const exactAmount = new Amount(
      selectedToken,
      withdrawRequest.data.asset_amount,
    )

    const tokenPrice =
      prices?.get(selectedToken.wrap().address) ??
      getOnchainPriceFromPool(selectedToken, pool)
    const usdValue =
      tokenPrice !== null ? Number(exactAmount.toString()) * tokenPrice : null

    return {
      singleAssetData: {
        exactAmount,
        usdValue,
      },
      hasTokenMismatch: false,
    }
  }, [
    selectedToken,
    withdrawRequest.data,
    withdrawRequest.isSuccess,
    prices,
    pool,
  ])

  const showPriceImpactWarning = useMemo(() => {
    if (
      !singleAssetData ||
      estimatedValue === 0 ||
      singleAssetData.usdValue === null
    )
      return false

    const actualUsdValue = singleAssetData.usdValue

    const difference =
      Math.abs(estimatedValue - actualUsdValue) / estimatedValue
    const priceImpact = new Percent({
      numerator: Math.floor(difference * 100),
      denominator: 100,
    })

    return !priceImpact.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [singleAssetData, estimatedValue])

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
        <Message variant="warning" size="sm">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon width={20} height={20} />
            <span className="font-medium">Token mismatch</span>
          </div>
          <p className="text-sm mb-3">
            The quote returned a different token than selected. Please try
            getting a new quote or select a different token.
          </p>
          <Button
            size="sm"
            onClick={handleGetQuote}
            disabled={withdrawRequest.isPending}
            variant="warning"
          >
            {withdrawRequest.isPending ? (
              <Dots>Getting quote</Dots>
            ) : (
              'Get New Quote'
            )}
          </Button>
        </Message>
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
      <List.Control>
        <div className="text-sm text-muted-foreground pt-3 px-3">
          You will receive:
        </div>
        <List.Item
          as="div"
          className="justify-between"
          iconProps={{}}
          title={
            <div className="flex items-center gap-3">
              <Currency.Icon currency={selectedToken} width={24} height={24} />
              <div>
                <div className="font-semibold text-sm">
                  {selectedToken.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedToken.name}
                </div>
              </div>
            </div>
          }
          value={
            <div className="text-right">
              <div className="font-semibold text-sm">
                {singleAssetData.exactAmount.toSignificant(6)}{' '}
                {selectedToken.symbol}
              </div>
              <div className="text-sm text-muted-foreground">
                {singleAssetData.usdValue !== null
                  ? formatUSD(singleAssetData.usdValue)
                  : '-'}
              </div>
            </div>
          }
        />
      </List.Control>
      {showPriceImpactWarning && <PriceImpactWarning />}
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
