import { Aptos, STABLECOINS } from 'lib/coins'
import { useMemo } from 'react'
import getCurrencyPrice from '../getCurrencyPrice'
import { Token } from '../tokenType'
import { useNetwork } from './useNetwork'
import usePairs from './usePairs'

interface UseStablePrice {
  currency: Token
  ledgerVersion?: number
}

export function useStablePrice({ currency, ledgerVersion }: UseStablePrice) {
  const { network, default_stable } = useNetwork()

  const native = useMemo(() => Aptos[network], [network])
  const stableTokens = useMemo(() => STABLECOINS[network], [network])

  const [nativePairInfo, stableNativePairInfo] = usePairs({
    currencies: useMemo(
      () => [
        [
          currency && native.address === currency.address
            ? undefined
            : currency,
          native,
        ],
        [native, default_stable],
      ],
      [native, default_stable, currency],
    ),
    ledgerVersion,
  })

  const stablePairsInfo = usePairs({
    currencies: useMemo(
      () =>
        stableTokens.map((stableToken) => {
          return [
            stableToken && currency.address === stableToken.address
              ? undefined
              : currency,
            stableToken,
          ]
        }),
      [stableTokens, currency],
    ),
    ledgerVersion,
  })

  return useMemo(() => {
    return getCurrencyPrice(
      currency,
      default_stable,
      native,
      stableTokens,
      nativePairInfo,
      stableNativePairInfo,
      stablePairsInfo,
    )
  }, [
    currency,
    default_stable,
    nativePairInfo,
    stableNativePairInfo,
    stablePairsInfo,
    stableTokens,
    native,
  ])
}
