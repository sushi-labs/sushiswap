import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { JSBI, Percent, TradeType, TradeVersion, WNATIVE, ZERO } from '@sushiswap/core-sdk'
import { selectTridentSwap, TypedField } from 'app/features/trident/swap/swapSlice'
import useCurrenciesFromURL from 'app/features/trident/useCurrenciesFromURL'
import { maxAmountSpend, toAmountCurrencyAmount } from 'app/functions'
import { getTradeVersion } from 'app/functions/getTradeVersion'
import { tryParseAmount } from 'app/functions/parse'
import { useBentoOrWalletBalance } from 'app/hooks/useBentoOrWalletBalance'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useBestTridentTrade } from 'app/hooks/useBestTridentTrade'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
import { useMemo } from 'react'

/*
  Private hook, specific for the Swap page component, do not use anywhere else for performance reasons.
  If you need anything from this hook, use useDerivedTridentSwapContext() instead
 */
export const _useSwapPage = () => {
  const { i18n } = useLingui()
  const { value, typedField, spendFromWallet } = useAppSelector(selectTridentSwap)
  const { account, chainId } = useActiveWeb3React()
  const {
    currencies: [currencyA, currencyB],
  } = useCurrenciesFromURL()
  const { rebases, loading: rebasesLoading } = useBentoRebases([currencyA, currencyB])

  const inputCurrencyAmount = useMemo(() => {
    return tryParseAmount(value, typedField === TypedField.A ? currencyA : currencyB)
  }, [currencyA, currencyB, typedField, value])

  const isWrap = useMemo(
    () =>
      currencyA &&
      currencyB &&
      !!chainId &&
      ((currencyA?.isNative && WNATIVE[chainId].address === currencyB?.wrapped.address) ||
        (currencyB?.isNative && WNATIVE[chainId].address === currencyA?.wrapped.address)),
    [chainId, currencyA, currencyB]
  )

  const { trade, priceImpact: _priceImpact } = useBestTridentTrade(
    typedField === TypedField.A ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    inputCurrencyAmount,
    typedField === TypedField.A ? currencyA : currencyB,
    typedField === TypedField.A ? currencyB : currencyA
  )

  const priceImpact = useMemo(
    () =>
      _priceImpact
        ? new Percent(
            _priceImpact.toString().toBigNumber(18).toString(),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
          )
        : undefined,
    [_priceImpact]
  )

  // trade.output but in normal amounts instead of shares
  const tradeOutputAmount = useMemo(() => {
    if (!trade) return undefined
    if (getTradeVersion(trade) === TradeVersion.V2TRADE) return trade.outputAmount
    if (
      getTradeVersion(trade) === TradeVersion.V3TRADE &&
      !rebasesLoading &&
      trade.outputAmount?.currency.wrapped.address &&
      rebases[trade?.outputAmount?.currency.wrapped.address]
    )
      // @ts-ignore TYPE NEEDS FIXING
      return toAmountCurrencyAmount(rebases[trade.outputAmount?.currency.wrapped.address], trade.outputAmount.wrapped)

    return undefined
  }, [rebases, rebasesLoading, trade])

  const balance = useBentoOrWalletBalance(account ?? undefined, currencyA, spendFromWallet)

  const formattedAmounts = useMemo(() => {
    if (isWrap) return [value, value]

    return [
      typedField === TypedField.A ? value : tradeOutputAmount?.toSignificant(6) ?? '',
      typedField === TypedField.B ? value : tradeOutputAmount?.toSignificant(6) ?? '',
    ]
  }, [isWrap, tradeOutputAmount, typedField, value])

  const parsedAmounts = useMemo(() => {
    if (isWrap) return [inputCurrencyAmount, inputCurrencyAmount]

    return [inputCurrencyAmount, tradeOutputAmount]
  }, [isWrap, inputCurrencyAmount, tradeOutputAmount])

  let error = useMemo(
    () =>
      !account
        ? i18n._(t`Connect Wallet`)
        : maxAmountSpend(balance)?.equalTo(ZERO)
        ? i18n._(t`Insufficient balance to cover for fees`)
        : // @ts-ignore TYPE NEEDS FIXING
        !trade?.inputAmount[0]?.greaterThan(ZERO) && !parsedAmounts[1]?.greaterThan(ZERO)
        ? i18n._(t`Enter an amount`)
        : trade === undefined && !isWrap
        ? i18n._(t`No route found`)
        : balance && trade && inputCurrencyAmount && maxAmountSpend(balance)?.lessThan(inputCurrencyAmount)
        ? i18n._(t`Insufficient Balance`)
        : '',
    [account, balance, i18n, inputCurrencyAmount, isWrap, parsedAmounts, trade]
  )

  return useMemo(
    () => ({
      isWrap,
      error,
      trade,
      priceImpact,
      formattedAmounts,
      parsedAmounts,
    }),
    [priceImpact, isWrap, error, trade, formattedAmounts, parsedAmounts]
  )
}

export default _useSwapPage
