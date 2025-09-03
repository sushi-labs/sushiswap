import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { useBladeWithdrawTransaction } from 'src/lib/pool/blade/useBladeWithdraw'
import { getPoolAssets } from 'src/lib/pool/blade/utils'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Amount, Percent } from 'sushi'
import { type EvmCurrency, getEvmChainById } from 'sushi/evm'
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useBladePoolPosition } from '../BladePoolPositionProvider'
import { MultipleAssetWithdrawal } from './MultipleAssetWithdrawal'
import {
  type RemoveOptionType,
  RemoveOptionsSelector,
} from './RemoveOptionsSelector'
import { SingleAssetWithdrawal } from './SingleAssetWithdrawal'

interface BladeRemoveLiquidityReviewModalProps {
  pool: BladePool
  percentage: string
  children: ReactNode
  onSuccess: () => void
}

export const BladeRemoveLiquidityReviewModal: FC<
  BladeRemoveLiquidityReviewModalProps
> = ({ pool, percentage, children, onSuccess: _onSuccess }) => {
  const { address } = useAccount()
  const client = usePublicClient()
  const { balance, liquidityToken } = useBladePoolPosition()
  const poolTotalSupply = useTotalSupply(liquidityToken)
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const chainId = pool.chainId
  const { data: prices } = usePrices({ chainId })

  const poolAssets = useMemo(
    () => getPoolAssets(pool).filter((asset) => asset.targetWeight > 0),
    [pool],
  )

  const percentToRemove = useMemo(
    () => new Percent({ numerator: BigInt(percentage), denominator: 100n }),
    [percentage],
  )

  const userPositionValue = useMemo(() => {
    if (
      !balance?.amount ||
      !poolTotalSupply?.amount ||
      poolTotalSupply.amount === 0n
    ) {
      return 0
    }

    const poolProportion =
      Number(balance.amount) / Number(poolTotalSupply.amount)
    return pool.liquidityUSD * poolProportion
  }, [balance, poolTotalSupply, pool.liquidityUSD])

  const tokensToReceive = useMemo(() => {
    return poolAssets
      .filter((asset) => 'token' in asset && asset.token)
      .map((asset) => {
        if ('token' in asset && asset.token) {
          const userAssetValue = userPositionValue * asset.weight
          const amountToReceiveValue =
            userAssetValue * (Number(percentage) / 100)

          // Get token price and calculate amount
          const tokenPrice = prices?.get(asset.token.wrap().address) || 0
          const tokenAmountValue =
            tokenPrice > 0 ? amountToReceiveValue / tokenPrice : 0
          const amount =
            tokenAmountValue > 0
              ? Amount.fromHuman(asset.token, tokenAmountValue)
              : new Amount(asset.token, 0n)

          return {
            usdValue: amountToReceiveValue,
            weight: asset.weight,
            amount,
          }
        }
        return null
      })
      .filter(Boolean) as Array<{
      usdValue: number
      weight: number
      amount: Amount<EvmCurrency>
    }>
  }, [poolAssets, userPositionValue, percentage, prices])

  const [selectedOption, setSelectedOption] = useState<RemoveOptionType>(() => {
    if (pool.isSingleAssetWithdrawEnabled && tokensToReceive.length > 0) {
      return tokensToReceive[0]?.amount.currency || 'multiple'
    }
    return 'multiple'
  })

  const amountToRemove = useMemo(() => {
    return balance && percentToRemove && percentToRemove.gt(0n)
      ? new Amount(
          balance.currency,
          percentToRemove.mul(balance.amount).quotient,
        )
      : undefined
  }, [balance, percentToRemove])

  const estimatedValue = useMemo(() => {
    return userPositionValue * (Number(percentage) / 100)
  }, [userPositionValue, percentage])

  const onSelectedOptionChange = useCallback((option: RemoveOptionType) => {
    setSelectedOption(option)
  }, [])

  const onSuccess = useCallback(
    (hash: `0x${string}`) => {
      _onSuccess()

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'burn',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Removing liquidity from the Blade pool`,
          completed: `Successfully removed liquidity from the Blade pool`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [refetchBalances, _onSuccess, address, chainId, client],
  )

  const onError = useCallback((e: Error) => {
    if (!isUserRejectedError(e)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const withdrawTransaction = useBladeWithdrawTransaction({
    pool,
    onSuccess,
    onError,
  })

  const { status } = useWaitForTransactionReceipt({
    chainId: pool.chainId,
    hash: withdrawTransaction.data,
  })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="!flex max-h-[80vh] max-w-md !flex-col">
              <DialogHeader>
                <DialogTitle>Select receive option</DialogTitle>
                <DialogDescription>
                  Select how you want to receive your underlying tokens in the
                  desired Blade pool asset(s).
                </DialogDescription>
              </DialogHeader>

              <RemoveOptionsSelector
                tokensToReceive={tokensToReceive}
                selectedOption={selectedOption}
                setSelectedOption={onSelectedOptionChange}
                prices={prices}
                estimatedValue={estimatedValue}
                isSingleAssetWithdrawEnabled={pool.isSingleAssetWithdrawEnabled}
              />

              {selectedOption === 'multiple' ? (
                <MultipleAssetWithdrawal
                  amountToRemove={amountToRemove}
                  onConfirm={confirm}
                  withdrawTransaction={withdrawTransaction}
                />
              ) : (
                <SingleAssetWithdrawal
                  key={
                    // Use the wrapped address for the key to preserve quote when switching between native and wrapped
                    selectedOption.wrap().address
                  }
                  pool={pool}
                  selectedToken={selectedOption}
                  amountToRemove={amountToRemove}
                  prices={prices}
                  onConfirm={confirm}
                  withdrawTransaction={withdrawTransaction}
                />
              )}
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={pool.chainId}
        status={status}
        testId="blade-remove-confirmation-modal"
        successMessage="Successfully removed liquidity"
        buttonText="Go to pool"
        buttonLink={`/${getEvmChainById(pool.chainId).key}/pool/blade/${pool.address}`}
        txHash={withdrawTransaction.data}
      />
    </DialogProvider>
  )
}
