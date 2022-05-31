import { ChainId, Currency, NATIVE, WNATIVE } from '@sushiswap/core-sdk'
import { tryParseAmount } from 'app/functions/parse'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

import { useWETH9Contract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType
  execute?: undefined | (() => Promise<void>)
  inputError?: string
} {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETH9Contract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency || chainId === ChainId.CELO)
      return NOT_APPLICABLE
    const weth = WNATIVE[chainId]
    if (!weth) return NOT_APPLICABLE

    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'))
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.isNative && weth.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({
                    value: `0x${inputAmount.quotient.toString(16)}`,
                  })
                  addTransaction(txReceipt, {
                    // @ts-ignore TYPE NEEDS FIXING
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${NATIVE[chainId].symbol} to ${
                      WNATIVE[chainId].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? // @ts-ignore TYPE NEEDS FIXING
            `Insufficient ${NATIVE[chainId].symbol} balance`
          : // @ts-ignore TYPE NEEDS FIXING
            `Enter ${NATIVE[chainId].symbol} amount`,
      }
    } else if (weth.equals(inputCurrency) && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${WNATIVE[chainId].symbol} to ${
                      // @ts-ignore TYPE NEEDS FIXING
                      NATIVE[chainId].symbol
                    }`,
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${WNATIVE[chainId].symbol} balance`
          : `Enter ${WNATIVE[chainId].symbol} amount`,
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction])
}
