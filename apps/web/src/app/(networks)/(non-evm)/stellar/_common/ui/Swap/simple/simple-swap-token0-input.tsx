import React, { useEffect, useTransition } from 'react'
import { useQuoteExactInput } from '~stellar/_common/lib/hooks/router'

import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken0Input = () => {
  const [, startTransition] = useTransition()
  const { amount, token0 } = useSimpleSwapState()
  const {
    setAmount,
    setToken0,
    setOutputAmount,
    setSlippageAmount,
    setPriceFetching,
    setError,
  } = useSimpleSwapActions()
  const {
    mutateAsync: getQuote,
    isPending: isQuotePending,
    isSuccess: isQuoteSuccess,
    data: quoteAmount,
    isError: isQuoteError,
    error: quoteError,
  } = useQuoteExactInput()

  useEffect(() => {
    setOutputAmount(0n)
    setSlippageAmount(0)

    if (Number(amount) > 0) {
      startTransition(async () => {
        await getQuote()
      })
    }
  }, [amount, getQuote, setOutputAmount, setSlippageAmount])

  useEffect(() => {
    if (isQuotePending) {
      setPriceFetching(true)
    } else {
      setPriceFetching(false)
    }
  }, [isQuotePending, setPriceFetching])

  useEffect(() => {
    if (isQuoteError) {
      setError(quoteError.message)
    } else {
      setError('')
    }
  }, [isQuoteError, quoteError, setError])

  useEffect(() => {
    if (isQuoteSuccess && quoteAmount && Number(amount) > 0) {
      try {
        const amountBigInt =
          typeof quoteAmount === 'bigint' ? quoteAmount : BigInt(quoteAmount)
        const absAmountBigInt = amountBigInt < 0n ? -amountBigInt : amountBigInt

        setOutputAmount(absAmountBigInt)

        if (absAmountBigInt <= BigInt(Number.MAX_SAFE_INTEGER)) {
          setSlippageAmount(Number(absAmountBigInt))
        } else {
          setSlippageAmount(0)
        }
      } catch {
        setOutputAmount(0n)
        setSlippageAmount(0)
      }
    }
  }, [isQuoteSuccess, quoteAmount, amount, setOutputAmount, setSlippageAmount])

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      onSelect={setToken0}
      token={token0}
      value={String(amount)}
      onChange={setAmount}
      className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
      label="Sell"
    />
  )
}
