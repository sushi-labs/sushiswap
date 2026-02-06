import { useMemo } from 'react'
import { Amount, getNativeAddress } from 'sushi'
import { type EvmChainId, EvmCurrency, EvmNative } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { useBalances } from './use-balances'

type Args<TChainId extends EvmChainId | SvmChainId> =
  | [CurrencyFor<TChainId> | undefined]
  | [TChainId | undefined, AddressFor<TChainId> | undefined]
type Return<TChainId extends EvmChainId | SvmChainId> = Omit<
  ReturnType<typeof useBalances<TChainId>>,
  'data'
> & {
  data: bigint | undefined
}

export function useBalance<TChainId extends EvmChainId | SvmChainId>(
  currency: CurrencyFor<TChainId> | undefined,
): Return<TChainId>
export function useBalance<TChainId extends EvmChainId | SvmChainId>(
  chainId: TChainId | undefined,
  tokenAddress: AddressFor<TChainId> | undefined,
): Return<TChainId>

export function useBalance<TChainId extends EvmChainId | SvmChainId>(
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

type UseAmountBalanceReturn<TChainId extends EvmChainId | SvmChainId> = Omit<
  ReturnType<typeof useBalance<TChainId>>,
  'data'
> & {
  data: Amount<CurrencyFor<TChainId>> | undefined
}

export function useAmountBalance(
  currency: CurrencyFor<EvmChainId> | undefined,
): UseAmountBalanceReturn<EvmChainId>
export function useAmountBalance(
  currency: CurrencyFor<SvmChainId> | undefined,
): UseAmountBalanceReturn<SvmChainId>
export function useAmountBalance<TChainId extends EvmChainId | SvmChainId>(
  currency: CurrencyFor<TChainId> | undefined,
): UseAmountBalanceReturn<TChainId> {
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
