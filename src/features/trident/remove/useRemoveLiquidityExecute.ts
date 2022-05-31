import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Token, WNATIVE } from '@sushiswap/core-sdk'
import {
  approveMasterContractAction,
  approveSLPAction,
  batchAction,
  burnLiquidityAction,
  sweepNativeTokenAction,
  unwrapWETHAction,
} from 'app/features/trident/actions'
import { usePoolContext } from 'app/features/trident/PoolContext'
import {
  selectTridentRemove,
  setRemoveAttemptingTxn,
  setRemoveDeletePermits,
} from 'app/features/trident/remove/removeSlice'
import { LiquidityOutput } from 'app/features/trident/types'
import { toShareJSBI } from 'app/functions/bentobox'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export const useRemoveLiquidityExecute = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const router = useTridentRouterContract()
  const addTransaction = useTransactionAdder()
  const dispatch = useAppDispatch()
  const { poolWithState, rebases } = usePoolContext()
  const { outputToWallet, receiveNative, bentoPermit, slpPermit } = useAppSelector(selectTridentRemove)

  return useCallback(
    async (slpAmountToRemove: CurrencyAmount<Token>, minLiquidityOutput: (CurrencyAmount<Token> | undefined)[]) => {
      const [minOutputA, minOutputB] = minLiquidityOutput

      if (
        !poolWithState?.pool ||
        !chainId ||
        !library ||
        !account ||
        !router ||
        !slpAmountToRemove ||
        !minOutputA ||
        !minOutputB ||
        !rebases?.[minOutputA.currency.wrapped.address] ||
        !rebases?.[minOutputB.currency.wrapped.address]
      )
        throw new Error('missing dependencies')

      const liquidityOutput: LiquidityOutput[] = [
        {
          token: minOutputA.wrapped.currency.address,
          amount: toShareJSBI(rebases[minOutputA.wrapped.currency.address], minOutputA.quotient).toString(),
        },
        {
          token: minOutputB.wrapped.currency.address,
          amount: toShareJSBI(rebases[minOutputB.wrapped.currency.address], minOutputB.quotient).toString(),
        },
      ]

      const indexOfWETH = minOutputA.wrapped.currency.address === WNATIVE[chainId].address ? 0 : 1
      // @ts-ignore TYPE NEEDS FIXING
      const receiveETH = receiveNative[0] && outputToWallet
      const actions = [
        approveMasterContractAction({ router, signature: bentoPermit }),
        approveSLPAction({ router, signatureData: slpPermit }),
        burnLiquidityAction({
          router,
          address: poolWithState.pool.liquidityToken.address,
          amount: slpAmountToRemove.quotient.toString(),
          recipient: receiveETH ? router.address : account,
          liquidityOutput,
          receiveToWallet: outputToWallet,
        }),
      ]

      if (receiveETH) {
        actions.push(
          unwrapWETHAction({
            chainId,
            router,
            amountMinimum: liquidityOutput[indexOfWETH].amount,
            recipient: account,
          }),
          sweepNativeTokenAction({
            router,
            token: liquidityOutput[indexOfWETH === 0 ? 1 : 0].token,
            recipient: account,
            amount: liquidityOutput[indexOfWETH === 0 ? 1 : 0].amount,
          })
        )
      }

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
            summary: i18n._(
              t`Remove ${slpAmountToRemove?.toSignificant(3)} ${slpAmountToRemove?.wrapped.currency.symbol}`
            ),
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
      poolWithState?.pool,
      chainId,
      library,
      account,
      router,
      rebases,
      receiveNative,
      outputToWallet,
      bentoPermit,
      slpPermit,
      dispatch,
      addTransaction,
      i18n,
    ]
  )
}
