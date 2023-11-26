import { Aptos, L0_USDC, STABLECOINS, USDC } from 'lib/coins'
import { useMemo } from 'react'
import usePairs from './usePairs'
import { Token } from './tokenType'
import getCurrencyPrice from './getCurrencyPrice'
import { useNetwork } from './useNetwork'
import { NetworkName } from '@aptos-labs/wallet-adapter-core'

interface UseStablePrice {
  currency: Token
  ledgerVersion?: number
}

export default function useStablePrice({ currency, ledgerVersion }: UseStablePrice) {
  const { network } = useNetwork()

  const defaultStable = useMemo(() => {
    if (network === NetworkName.Testnet) {
      return USDC[network]
    }
    return L0_USDC[network]
  }, [network])
  const native = useMemo(() => Aptos[network], [network])

  const stableTokens = useMemo(() => STABLECOINS[network], [network])

  const [nativePairInfo, stableNativePairInfo] = usePairs({
    currencies: useMemo(
      () => [
        [currency && native.address === currency.address ? undefined : currency, native],
        [native, defaultStable],
      ],
      [native, defaultStable, currency]
    ),
    ledgerVersion,
  })

  const stablePairsInfo = usePairs({
    currencies: useMemo(
      () =>
        stableTokens.map((stableToken) => {
          return [stableToken && currency.address === stableToken.address ? undefined : currency, stableToken]
        }),
      [stableTokens, currency]
    ),
    ledgerVersion,
  })

  return useMemo(() => {
    return getCurrencyPrice(
      currency,
      defaultStable,
      native,
      stableTokens,
      nativePairInfo,
      stableNativePairInfo,
      stablePairsInfo
    )
  }, [currency, defaultStable, nativePairInfo, stableNativePairInfo, stablePairsInfo, stableTokens, native])
}
