import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { hexConcat, hexlify, Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  KASHI_ADDRESS,
  Rebase,
  SUSHISWAP_MULTISWAPPER_ADDRESS,
  Trade as LegacyTrade,
  TradeType,
} from '@sushiswap/core-sdk'
import KashiCooker from 'app/entities/KashiCooker'
import { toShare, ZERO } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

import { useKashiMarket } from '..'

export interface BorrowExecutePayload {
  permit?: Signature
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  spendFromWallet: boolean
  receiveInWallet: boolean
  leveraged: boolean
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT>
}

type UseBorrowExecute = () => (x: BorrowExecutePayload) => Promise<TransactionResponse | undefined>

export const useBorrowExecute: UseBorrowExecute = () => {
  const { i18n } = useLingui()
  const { account, library, chainId } = useActiveWeb3React()
  const masterContract = chainId && KASHI_ADDRESS[chainId]
  const addTransaction = useTransactionAdder()
  const allowedSlippage = useAppSelector(selectSlippage)
  const { market } = useKashiMarket()

  return useCallback(
    async ({ trade, permit, collateralAmount, borrowAmount, leveraged, spendFromWallet, receiveInWallet }) => {
      if (!account || !library || !chainId || !masterContract || (!collateralAmount && !borrowAmount)) {
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

      if (borrowAmount) {
        // Always update exchange rate
        cooker.updateExchangeRate(true, ZERO, ZERO)

        // Add deposit collateral action
        if (leveraged && spendFromWallet && collateralAmount) {
          cooker.bentoDepositCollateral(BigNumber.from(collateralAmount.quotient.toString()))
        }
        // Add borrow action
        cooker.borrow(
          BigNumber.from(borrowAmount.quotient.toString()),
          leveraged || !receiveInWallet,
          leveraged ? SUSHISWAP_MULTISWAPPER_ADDRESS[chainId] : ''
        )
      }

      // If we're leveraged, check for trade object and add actions accordingly
      if (leveraged && trade && collateralAmount) {
        const path = trade.route.path.map((token) => token.address) || []
        cooker.action(
          SUSHISWAP_MULTISWAPPER_ADDRESS[chainId || 1],
          ZERO,
          hexConcat([
            hexlify('0x3087d742'),
            defaultAbiCoder.encode(
              ['address', 'address', 'uint256', 'address', 'address', 'address', 'uint256'],
              [
                market.asset.token.address,
                market.collateral.token.address,
                BigNumber.from(trade.minimumAmountOut(allowedSlippage).quotient.toString()),
                path.length > 2 ? path[1] : AddressZero,
                path.length > 3 ? path[2] : AddressZero,
                account,
                toShare(
                  {
                    base: JSBI.BigInt(market.collateral.base.toString()),
                    elastic: JSBI.BigInt(market.collateral.elastic.toString()),
                  } as Rebase,
                  BigNumber.from(collateralAmount.quotient.toString())
                ),
              ]
            ),
          ]),
          false,
          true,
          1
        )
      }

      if (collateralAmount) {
        // Add collateral action
        cooker.addCollateral(
          leveraged ? BigNumber.from(-1) : BigNumber.from(collateralAmount.quotient.toString()),
          leveraged || !spendFromWallet
        )
      }

      // console.log(cooker)

      // Batch all actions
      const result = await cooker.cook()

      if (collateralAmount && borrowAmount && result.success) {
        addTransaction(result.tx, {
          summary: i18n._(
            t`Borrow ${borrowAmount.toSignificant(6)} ${
              borrowAmount.currency.symbol
            } using ${collateralAmount.toSignificant(6)} ${collateralAmount.currency.symbol} as collateral`
          ),
        })
      }

      if (collateralAmount && !borrowAmount && result.success) {
        addTransaction(result.tx, {
          summary: i18n._(
            t`Adding ${collateralAmount.toSignificant(6)} ${collateralAmount.currency.symbol} as collateral`
          ),
        })
      }

      if (!collateralAmount && borrowAmount && result.success) {
        addTransaction(result.tx, {
          summary: i18n._(t`Borrow ${borrowAmount.toSignificant(6)} ${borrowAmount.currency.symbol}`),
        })
      }

      return result.tx
    },
    [account, addTransaction, allowedSlippage, chainId, i18n, library, market, masterContract]
  )
}
