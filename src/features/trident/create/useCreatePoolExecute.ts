import { Signature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, toHex } from '@sushiswap/core-sdk'
import { approveMasterContractAction, batchAction } from 'app/features/trident/actions'
import { PoolCreationActionProps, poolCreationActions } from 'app/features/trident/create/actions'
import {
  selectTridentCreate,
  setCreateAttemptingTxn,
  setCreateBentoPermit,
} from 'app/features/trident/create/createSlice'
import { SpendSource } from 'app/features/trident/create/SelectedAsset'
import { useCreatePoolDerivedDependencyError } from 'app/features/trident/create/useCreateDerivedState'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPoolFactory, useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

type ExecutePayload = {
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[]
  bentoPermit?: Signature
}

type UseCreatePoolExecute = () => (x: ExecutePayload) => Promise<TransactionResponse | undefined>
export const useCreatePoolExecute: UseCreatePoolExecute = () => {
  const { i18n } = useLingui()
  const { account, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const constantProductPoolFactory = useConstantProductPoolFactory()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()

  const { selectedAssets: assets, selectedFeeTier: feeTier, createAnOracle: twap } = useAppSelector(selectTridentCreate)
  const { rebases } = useBentoRebases(assets.map((asset) => asset.currency))
  const error = useCreatePoolDerivedDependencyError()

  return useCallback(
    async ({ parsedAmounts, bentoPermit }) => {
      if (error || !router || !library || !account) {
        alert(`Dependency error: ${error}`)
        return
      }

      let value = '0x0'
      if (parsedAmounts?.[0]?.currency.isNative && assets[0].spendFromSource === SpendSource.WALLET)
        value = toHex(parsedAmounts[0])
      if (parsedAmounts?.[1]?.currency.isNative && assets[1].spendFromSource === SpendSource.WALLET)
        value = toHex(parsedAmounts[1])

      try {
        dispatch(setCreateAttemptingTxn(true))
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: router.address,
          data: batchAction({
            contract: router,
            actions: [
              approveMasterContractAction({ router, signature: bentoPermit }),
              ...poolCreationActions(
                {
                  account,
                  assets,
                  constantProductPoolFactory,
                  router,
                  feeTier,
                  twap,
                  parsedAmounts,
                  rebases,
                } as PoolCreationActionProps /* Can cast given the error guard above */
              ),
            ],
          }),
          value,
        })

        if (tx?.hash) {
          addTransaction(tx, {
            summary: i18n._(
              t`Create pool and add liquidity for tokens ${assets[0].currency!!.symbol} and ${
                assets[1].currency!!.symbol
              }`
            ),
          })

          await tx.wait()
        }

        dispatch(setCreateAttemptingTxn(false))

        gtag('event', 'Create', {
          event_category: 'Constant Product Pool',
          event_label: [assets[0].currency!!.symbol, assets[1].currency!!.symbol].join('/'),
        })

        dispatch(setCreateBentoPermit(undefined))
        return tx
      } catch (error) {
        dispatch(setCreateAttemptingTxn(false))
        if (error instanceof String) {
          alert(`Error with pool creation: ${error}`)
        }
        // we only care if the error is something _other_ than the user rejected the tx
        if ((error as { code: number }).code !== USER_REJECTED_TX) {
          alert(`Error with pool creation: ${JSON.stringify(error)}`)
        }
        console.error(error)
      }
    },
    [
      account,
      addTransaction,
      assets,
      constantProductPoolFactory,
      dispatch,
      error,
      feeTier,
      i18n,
      library,
      rebases,
      router,
      twap,
    ]
  )
}
