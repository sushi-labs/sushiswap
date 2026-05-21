import { useMemo } from 'react'
import { Amount, getNativeAddress } from 'sushi'
import type { BalanceChainId } from './types'
import { useBalances } from './use-balances'

type Args<TChainId extends BalanceChainId> =
  | [CurrencyFor<TChainId> | undefined]
  | [TChainId | undefined, AddressFor<TChainId> | undefined]
type Return<TChainId extends BalanceChainId> = Omit<
  ReturnType<typeof useBalances<TChainId>>,
  'data'
> & {
  data: bigint | undefined
}

export function useBalance<TChainId extends BalanceChainId>(
  currency: CurrencyFor<TChainId> | undefined,
): Return<TChainId>
export function useBalance<TChainId extends BalanceChainId>(
  chainId: TChainId | undefined,
  tokenAddress: AddressFor<TChainId> | undefined,
): Return<TChainId>

export function useBalance<TChainId extends BalanceChainId>(
  arg1: Args<TChainId>[0],
  arg2?: Args<TChainId>[1],
) {
  const [chainId, tokenAddresses] = useMemo(() => {
    if (!arg1) {
      return [undefined, []]
    }

    if (typeof arg1 === 'number') {
      return [arg1, arg2 ? [arg2] : []]
    }

    const address =
      arg1.type === 'native'
        ? getNativeAddress(arg1.chainId as TChainId)
        : (arg1.address as AddressFor<TChainId>)

    return [arg1.chainId, [address]]
  }, [arg1, arg2])

  const result = useBalances(chainId, tokenAddresses)

  const tokenAddress = tokenAddresses[0]

  return useMemo(() => {
    return {
      ...result,
      data: tokenAddress ? result.data?.get(tokenAddress) : undefined,
    }
  }, [tokenAddress, result])
}

type UseAmountBalanceReturn<TCurrency extends CurrencyFor<BalanceChainId>> =
  Omit<ReturnType<typeof useBalance<TCurrency['chainId']>>, 'data'> & {
    data: Amount<TCurrency> | undefined
  }

export function useAmountBalance<TCurrency extends CurrencyFor<BalanceChainId>>(
  currency: TCurrency | undefined,
): UseAmountBalanceReturn<TCurrency> {
  const result = useBalance(currency)

  return useMemo(() => {
    if (!currency || result.data === undefined) {
      return {
        ...result,
        data: undefined,
      }
    }

    const amount = new Amount(currency, result.data)

    return {
      ...result,
      data: amount,
    }
  }, [currency, result])
}
