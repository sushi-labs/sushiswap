import { useMemo } from 'react'
import { Amount, type IDFor, LowercaseMap, getNativeAddress } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import {
  type StellarChainId,
  type StellarContractAddress,
  isStellarChainId,
} from 'sushi/stellar'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import type { BalanceChainId, UseBalancesReturn } from './types'
import { useEvmBalances } from './use-evm-balances'
import { useStellarBalances } from './use-stellar-balances'
import { useSvmBalances } from './use-svm-balances'

export function useBalances<TChainId extends BalanceChainId>(
  chainId: TChainId | undefined,
  tokenAddresses: AddressFor<TChainId>[] | undefined,
): UseBalancesReturn<TChainId> {
  const evmChainId = chainId && isEvmChainId(chainId) ? chainId : undefined
  const evmTokenAddresses = evmChainId
    ? (tokenAddresses as AddressFor<EvmChainId>[])
    : undefined

  const evmBalances = useEvmBalances(evmChainId, evmTokenAddresses)

  const svmChainId = chainId && isSvmChainId(chainId) ? chainId : undefined
  const svmTokenAddresses = svmChainId
    ? (tokenAddresses as AddressFor<SvmChainId>[])
    : undefined

  const svmBalances = useSvmBalances(svmChainId, svmTokenAddresses)

  const stellarChainId =
    chainId && isStellarChainId(chainId) ? chainId : undefined
  const stellarTokenAddresses = stellarChainId
    ? (tokenAddresses as StellarContractAddress[])
    : undefined

  const stellarBalances = useStellarBalances(
    stellarChainId,
    stellarTokenAddresses,
  )

  if (!chainId) {
    return {
      data: undefined,
      isError: false,
      isLoading: false,
      isFetching: false,
    }
  }

  if (evmChainId) {
    return evmBalances as UseBalancesReturn<TChainId>
  }

  if (svmChainId) {
    return svmBalances as UseBalancesReturn<TChainId>
  }

  if (stellarChainId) {
    return stellarBalances as UseBalancesReturn<TChainId>
  }

  throw new Error('Unsupported chainId')
}

export function useAmountBalances<TChainId extends BalanceChainId>(
  chainId: TChainId | undefined,
  _currencies: (CurrencyFor<TChainId> | undefined)[] | undefined,
) {
  const currencies = useMemo(() => {
    if (!_currencies) {
      return undefined
    }

    return _currencies.filter(
      (currency) => currency !== undefined,
    ) as CurrencyFor<TChainId>[]
  }, [_currencies])

  const tokenAddresses = useMemo(() => {
    if (!currencies) {
      return undefined
    }

    return currencies.map((currency) => {
      if (currency.chainId !== chainId) {
        throw new Error(
          'useAmountBalances: All currencies must be on the same chain',
        )
      }

      if (currency.type === 'native') {
        return getNativeAddress(chainId)
      }

      return currency.address as AddressFor<TChainId>
    })
  }, [chainId, currencies])

  const result = useBalances(chainId, tokenAddresses)

  return useMemo(() => {
    if (!chainId || !currencies || result.data === undefined) {
      return {
        ...result,
        data: undefined,
      }
    }

    const nativeAddress = getNativeAddress(chainId)
    let amountMap: Map<IDFor<TChainId, true>, Amount<CurrencyFor<TChainId>>>

    if (isEvmChainId(chainId)) {
      amountMap = new LowercaseMap()
    } else {
      amountMap = new Map()
    }

    currencies.forEach((currency) => {
      const address =
        currency.type === 'native'
          ? nativeAddress
          : (currency.address as AddressFor<TChainId>)
      const amount = result.data.get(address)

      if (amount === undefined) {
        return
      }

      amountMap.set(
        currency.id as IDFor<TChainId, true>,
        new Amount(currency, amount),
      )
    })

    return {
      ...result,
      data: amountMap as ReadonlyMap<
        IDFor<TChainId, true>,
        Amount<CurrencyFor<TChainId>>
      >,
    }
  }, [currencies, result, chainId])
}
