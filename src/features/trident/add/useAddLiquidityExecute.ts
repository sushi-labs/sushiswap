import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, toHex, Token } from '@sushiswap/core-sdk'
import { approveMasterContractAction, batchAction, getAsEncodedAction } from 'app/features/trident/actions'
import { setAddAttemptingTxn, setAddBentoPermit } from 'app/features/trident/add/addSlice'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { LiquidityInput } from 'app/features/trident/types'
import { toShareJSBI } from 'app/functions'
import { useTridentRouterContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { USER_REJECTED_TX } from 'app/services/web3/WalletError'
import { useAppDispatch } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

type ExecutePayload = {
  parsedAmounts: (CurrencyAmount<Currency> | undefined)[]
  spendFromWallet: [boolean, boolean]
  liquidityMinted?: CurrencyAmount<Token>
  bentoPermit?: Signature
}

type UseAddLiquidityExecute = () => (x: ExecutePayload) => Promise<TransactionResponse | undefined>

export const useAddLiquidityExecute: UseAddLiquidityExecute = () => {
  const { i18n } = useLingui()
  const { poolWithState, rebases } = usePoolContext()
  const { chainId, library, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const router = useTridentRouterContract()

  return useCallback(
    async ({ parsedAmounts, spendFromWallet, liquidityMinted, bentoPermit }) => {
      const [parsedAmountA, parsedAmountB] = parsedAmounts
      const [nativeA, nativeB] = spendFromWallet

      if (!poolWithState?.pool || !chainId || !library || !account || !router || !liquidityMinted || !rebases) return
      const { pool } = poolWithState

      let value = '0x0'
      const liquidityInput: LiquidityInput[] = []
      const encoded = defaultAbiCoder.encode(['address'], [account])

      if (parsedAmountA) {
        if (parsedAmountA.currency.isNative && nativeA) {
          value = toHex(parsedAmountA)
        }

        liquidityInput.push({
          token: parsedAmountA.currency.isNative && nativeA ? AddressZero : parsedAmountA.currency.wrapped.address,
          native: nativeA,
          amount: nativeA
            ? parsedAmountA.quotient.toString()
            : toShareJSBI(rebases[parsedAmountA.wrapped.currency.address], parsedAmountA.quotient).toString(),
        })
      }

      if (parsedAmountB) {
        if (parsedAmountB.currency.isNative && nativeB) {
          value = toHex(parsedAmountB)
        }

        liquidityInput.push({
          token: parsedAmountB.currency.isNative && nativeB ? AddressZero : parsedAmountB.currency.wrapped.address,
          native: nativeB,
          amount: nativeB
            ? parsedAmountB.quotient.toString()
            : toShareJSBI(rebases[parsedAmountB.wrapped.currency.address], parsedAmountB.quotient).toString(),
        })
      }

      if (liquidityInput.length === 0) return

      try {
        dispatch(setAddAttemptingTxn(true))
        const tx = await library.getSigner().sendTransaction({
          from: account,
          to: router.address,
          data: batchAction({
            contract: router,
            actions: [
              approveMasterContractAction({ router, signature: bentoPermit }),
              getAsEncodedAction({
                contract: router,
                fn: 'addLiquidity',
                args: [liquidityInput, pool.liquidityToken.address, liquidityMinted.quotient.toString(), encoded],
              }),
            ],
          }),
          value,
        })

        if (tx?.hash) {
          addTransaction(tx, {
            summary: i18n._(
              t`Add ${parsedAmountA?.toSignificant(3)} ${
                parsedAmountA?.currency.symbol
              } and ${parsedAmountB?.toSignificant(3)} ${parsedAmountB?.currency.symbol} into ${pool.token0.symbol}/${
                pool.token1.symbol
              }`
            ),
          })

          await tx.wait()
        }

        dispatch(setAddAttemptingTxn(false))

        gtag('event', 'Add', {
          event_category: 'Liquidity',
          event_label: [pool.token0.symbol, pool.token1.symbol].join('/'),
        })

        dispatch(setAddBentoPermit(undefined))
        return tx
      } catch (error) {
        dispatch(setAddAttemptingTxn(false))
        // we only care if the error is something _other_ than the user rejected the tx
        // @ts-ignore TYPE NEEDS FIXING
        if (error?.code !== USER_REJECTED_TX) {
          console.error(error)
        }
      }
    },
    [poolWithState, chainId, library, account, router, rebases, dispatch, addTransaction, i18n]
  )
}
