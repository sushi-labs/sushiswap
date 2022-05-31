import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import {
  approveMasterContractAction,
  approveSLPAction,
  batchAction,
  burnLiquiditySingleAction,
  unwrapWETHAction,
} from 'app/features/trident/actions'
import { usePoolContext } from 'app/features/trident/PoolContext'
import {
  selectTridentRemove,
  setRemoveAttemptingTxn,
  setRemoveDeletePermits,
} from 'app/features/trident/remove/removeSlice'
import { useRemoveLiquidityZapCurrency } from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks'
import { useBentoRebase } from 'app/hooks/useBentoRebases'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useRemoveLiquiditySingleExecute = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const { poolWithState } = usePoolContext()
  const { bentoPermit, outputToWallet, slpPermit } = useAppSelector(selectTridentRemove)
  const zapCurrency = useRemoveLiquidityZapCurrency()
  const { rebase } = useBentoRebase(zapCurrency?.wrapped)

  return useCallback(
    async (slpAmountToRemove: CurrencyAmount<Token>, minOutputAmount: CurrencyAmount<Currency>) => {
      if (
        !poolWithState?.pool ||
        !chainId ||
        !library ||
        !account ||
        !router ||
        !minOutputAmount ||
        !rebase ||
        !slpAmountToRemove
      )
        throw new Error('missing dependencies')

      const receiveETH = zapCurrency?.isNative && outputToWallet
      const actions = [
        approveMasterContractAction({ router, signature: bentoPermit }),
        approveSLPAction({ router, signatureData: slpPermit }),
        burnLiquiditySingleAction({
          router,
          address: poolWithState.pool.liquidityToken.address,
          token: minOutputAmount.currency.wrapped.address,
          amount: slpAmountToRemove.quotient.toString(),
          recipient: receiveETH ? router.address : account,
          minWithdrawal: toShareJSBI(rebase, minOutputAmount.quotient).toString(),
          receiveToWallet: outputToWallet,
        }),
      ]

      if (receiveETH)
        actions.push(
          unwrapWETHAction({
            chainId,
            router,
            amountMinimum: toShareJSBI(rebase, minOutputAmount.quotient).toString(),
            recipient: account,
          })
        )

      try {
        dispatch(setRemoveAttemptingTxn(true))
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: router.address,
          data: batchAction({
            contract: router,
            actions,
          }),
          value: '0x0',
        })

        if (tx?.hash) {
          addTransaction(tx, {
            summary: i18n._(t`Remove ${slpAmountToRemove?.toSignificant(3)} ${slpAmountToRemove?.currency.symbol}`),
          })
          await tx.wait()
        }

        dispatch(setRemoveAttemptingTxn(false))

        gtag('event', 'Burn', {
          event_category: 'Liquidity',
          event_label: [poolWithState.pool.token0.symbol, poolWithState.pool.token1.symbol].join('/'),
        })

        dispatch(setRemoveDeletePermits())
        return tx
      } catch (error) {
        dispatch(setRemoveAttemptingTxn(false))
        // we only care if the error is something _other_ than the user rejected the tx
        // @ts-ignore TYPE NEEDS FIXING
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      }
    },
    [
      account,
      addTransaction,
      bentoPermit,
      chainId,
      dispatch,
      i18n,
      library,
      outputToWallet,
      poolWithState?.pool,
      rebase,
      router,
      slpPermit,
      zapCurrency?.isNative,
    ]
  )
}
