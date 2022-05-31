import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, JSBI, KASHI_ADDRESS, Rebase } from '@sushiswap/core-sdk'
import KashiCooker from 'app/entities/KashiCooker'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { minimum, toShare } from 'app/functions'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export interface WithdrawExecutePayload {
  withdrawAmount?: CurrencyAmount<Currency>
  receiveToWallet: boolean
  permit?: Signature
  removeMax: boolean
}

type UseWithdrawExecute = () => (x: WithdrawExecutePayload) => Promise<TransactionResponse | undefined>

export const useWithdrawExecute: UseWithdrawExecute = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()
  const masterContract = chainId && KASHI_ADDRESS[chainId]

  return useCallback(
    async ({ withdrawAmount, receiveToWallet, permit, removeMax = false }) => {
      if (!account || !library || !chainId || !masterContract || !bentoBoxContract || !withdrawAmount) {
        console.error('Dependencies unavailable')
        return
      }

      const cooker = new KashiCooker(market, account, library, chainId)

      // Add permit if available
      if (permit) {
        cooker.approve({
          account,
          masterContract,
          v: permit.v,
          r: permit.r,
          s: permit.s,
        })
      }

      const fraction = removeMax
        ? minimum(market.userAssetFraction.toString(), market.maxAssetAvailableFraction.toString())
        : toShare(
            {
              base: market.currentTotalAsset.base,
              elastic: JSBI.BigInt(market.currentAllAssets.toString()),
            } as Rebase,
            BigNumber.from(withdrawAmount.quotient.toString())
          )

      cooker.removeAsset(fraction, !receiveToWallet)
      const result = await cooker.cook()

      if (result.success) {
        addTransaction(result.tx, {
          summary: i18n._(t`Withdraw ${withdrawAmount.toSignificant(6)} ${withdrawAmount.currency.symbol}`),
        })

        return result.tx
      }
    },
    [account, addTransaction, bentoBoxContract, chainId, i18n, library, market, masterContract]
  )
}
