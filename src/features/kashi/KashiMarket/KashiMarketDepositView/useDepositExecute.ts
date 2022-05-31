import { BigNumber } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, KASHI_ADDRESS } from '@sushiswap/core-sdk'
import KashiCooker from 'app/entities/KashiCooker'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { useBentoBoxContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export interface DepositExecutePayload {
  depositAmount?: CurrencyAmount<Currency>
  spendFromWallet: boolean
  permit?: Signature
}

type UseDepositExecute = () => (x: DepositExecutePayload) => Promise<TransactionResponse | undefined>

export const useDepositExecute: UseDepositExecute = () => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()
  const { account, library, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const bentoBoxContract = useBentoBoxContract()
  const masterContract = chainId && KASHI_ADDRESS[chainId]

  return useCallback(
    async ({ depositAmount, spendFromWallet, permit }) => {
      if (!account || !library || !chainId || !masterContract || !bentoBoxContract || !depositAmount) {
        console.error('Dependencies unavailable')
        return
      }

      const cooker = new KashiCooker(market, account, library, chainId)

      console.log({ permit })

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

      const deadBalance = await bentoBoxContract.balanceOf(
        market.asset.token.address,
        '0x000000000000000000000000000000000000dead'
      )

      cooker.addAsset(BigNumber.from(depositAmount.quotient.toString()), !spendFromWallet, deadBalance.isZero())
      const result = await cooker.cook()

      if (result.success) {
        addTransaction(result.tx, {
          summary: i18n._(t`Deposit ${depositAmount.toSignificant(6)} ${depositAmount.currency.symbol}`),
        })

        return result.tx
      }
    },
    [account, addTransaction, bentoBoxContract, chainId, i18n, library, market, masterContract]
  )
}
